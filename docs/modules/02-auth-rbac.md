# VendorFlow — Phase 2: Authentication & Role-Based Access Control (RBAC)

## 1. Phase Overview
Phase 2 implements the security, identity, and authorization backbone for **VendorFlow**. It establishes authentication mechanisms and granular Role-Based Access Control (RBAC) across three system personas:
- **Admin**: Vendor verification, system governance, and compliance administration.
- **Buyer**: Requisitioning, purchase order creation, and vendor performance scoring.
- **Vendor**: Profile onboarding, compliance document submission, and order fulfillment.

In this phase, we:
- Built authentication endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/auth/me`.
- Implemented short-lived JSON Web Tokens (JWT) signed with `{ id, role }` claims.
- Configured cookie security transmitting JWTs inside **`httpOnly`**, **`SameSite=Lax/Strict`** cookies (mitigating XSS extraction) with an in-memory fallback for Axios authorization header interceptors.
- Developed `authMiddleware` (token extraction & verification) and `roleMiddleware(...roles)` (RBAC gatekeeping).
- Protected API routes, returning `401 Unauthorized` for missing/invalid tokens and `403 Forbidden` for role mismatches.
- Created interactive **Login** and **Register** views on the client with input validation, error handling, quick-fill demo credentials, and automatic redirection to role-specific workspaces.
- Implemented client session recovery on app boot via `/api/auth/me` and wrapped protected workspace routes inside a `ProtectedRoute` component.

---

## 2. Request → Response Data Flow for Authentication & Protected Routes

### A. Login & Token Issuance Flow
```
[User submits email + password on /login]
                  │
                  ▼
[POST /api/auth/login]
                  │
                  ▼
[authController.loginUser]
                  ├─► User.findOne({ email }).select('+password')
                  ├─► user.matchPassword(enteredPassword) -> bcrypt.compare()
                  ├─► jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' })
                  ├─► res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 3600000 })
                  ├─► AuditLog.create({ action: 'USER_LOGIN', entityId: user._id })
                  ▼
[HTTP 200 OK + Set-Cookie: token=...; HttpOnly]
  Response Body: { status: 'success', data: { user: { id, name, email, role }, token } }
                  │
                  ▼
[Client: authSlice extraReducers]
  -> state.isAuthenticated = true
  -> state.user = action.payload
  -> In-memory memoryToken cached for Axios interceptor
  -> navigate('/admin' | '/buyer' | '/vendor') based on user.role
```

### B. Accessing Protected Route (`GET /api/dev/admin-only`)
```
[Client Axios Request]
  (Cookie 'token' sent automatically via withCredentials: true
   OR attached in Authorization: Bearer <memoryToken> header)
                  │
                  ▼
[Express Server Pipeline]
                  │
                  ▼
[Middleware 1: cookieParser()] -> Populates req.cookies
                  │
                  ▼
[Middleware 2: authMiddleware]
  ├─► Extracts token from req.cookies.token OR req.headers.authorization
  │    (If missing -> HTTP 401: "Not authorized: No authentication token provided")
  ├─► jwt.verify(token, JWT_SECRET)
  │    (If invalid/expired -> HTTP 401: "Not authorized: Token has expired")
  ├─► User.findById(decoded.id).select('-password')
  ├─► Attaches user to req.user
  └─► next()
                  │
                  ▼
[Middleware 3: roleMiddleware('Admin')]
  ├─► Checks req.user.role === 'Admin'
  │    (If mismatch -> HTTP 403: "Forbidden: Role 'Vendor' is not authorized to access this resource")
  └─► next()
                  │
                  ▼
[Route Controller Handler]
  HTTP 200 OK: { status: 'success', message: 'Access granted: Welcome to Admin restricted zone' }
```

---

## 3. Key Files and Responsibilities

| File Path | Description |
|---|---|
| `server/src/utils/jwt.js` | Generates signed JWTs containing `{ id, role }` and sets secure `httpOnly` cookie on Express responses. |
| `server/src/middleware/authMiddleware.js` | Exports `authMiddleware` (extracts & validates JWT, attaches `req.user`) and `roleMiddleware` (enforces role allowances returning 403 on mismatch). |
| `server/src/controllers/authController.js` | Handles user registration with audit logging, login authentication, logout cookie clearing, and `/api/auth/me` profile lookup. |
| `server/src/routes/authRoutes.js` | Router exposing `/api/auth/register`, `/login`, `/logout`, and `/me`. |
| `server/src/routes/devRoutes.js` | Test routes demonstrating unauthenticated, authenticated, and role-gated endpoints (`/protected`, `/admin-only`, `/buyer-only`, `/vendor-only`). |
| `client/src/api/axiosClient.js` | Configured with `withCredentials: true` and request interceptor attaching in-memory JWT header. |
| `client/src/store/slices/authSlice.js` | Redux slice managing `login`, `register`, `logout`, and `checkAuthStatus` async thunks and user authentication state. |
| `client/src/components/ProtectedRoute.jsx` | Guards client routes, verifies authentication status, checks role authorization, and redirects to appropriate dashboard. |
| `client/src/pages/LoginPage.jsx` | Login form with client validation, demo account autofill buttons, and redirection to role workspace upon successful auth. |
| `client/src/pages/RegisterPage.jsx` | Registration form with validation and role selector (`Buyer`, `Vendor`, `Admin`). |
| `client/src/layouts/BaseLayout.jsx` | Top navigation displaying authenticated user chip, role tag, and sign-out button. |

---

## 4. Internals & Architectural Decisions

### What Bcrypt Salting Does and Why It Matters
When hashing passwords, naive cryptographic hashing (like `sha256(password)`) is vulnerable to **rainbow table lookups** (precomputed tables of billions of common password hashes) and dictionary attacks.

1. **A Salt is Random Noise**: Before hashing, `bcrypt` generates a cryptographically random string (the "salt") and concatenates it with the password.
2. **Prevents Identical Hashes**: Two users with the exact same password (`Password123!`) will produce completely different hash strings because their salts differ.
3. **Neutralizes Rainbow Tables**: Precomputed lookup tables become useless because an attacker must recompute hashes for every possible salt value.
4. **Adaptive Cost Factor**: Bcrypt incorporates a work factor (in our implementation, 10 rounds: $2^{10} = 1024$ iterations). As hardware speeds up, the work factor can be increased to make brute-force attacks computationally expensive.

### JWT Structure and Signing vs Encryption
A JSON Web Token consists of three base64url-encoded parts separated by periods: `Header.Payload.Signature`.
- **Header**: Encodes the token type and hashing algorithm (`{"alg": "HS256", "typ": "JWT"}`).
- **Payload**: Contains the claims (`{"id": "...", "role": "Admin", "iat": 1728662400, "exp": 1728666000}`).
- **Signature**: Formed by taking `HMACSHA256(base64Url(Header) + "." + base64Url(Payload), secret)`.

**Signing != Encryption**:
- **Signing Guarantees Integrity and Authenticity**: Anyone who possesses the token can base64-decode the payload and read the claims (`id`, `role`). The signature guarantees that the payload **has not been tampered with** and **was issued by our server**. If a malicious client modifies `role: "Vendor"` to `role: "Admin"`, the signature verification will fail because only the server possesses the `JWT_SECRET`.
- **Signing is NOT Confidentiality**: Sensitive information (passwords, social security numbers, private keys) must never be placed inside a JWT payload because it is not encrypted.

### Stateless Auth vs Sessions and the Revocation Trade-Off
- **Stateless Auth (JWT)**:
  - **Pros**: The backend does not need to query a session store (Redis or database) on every single API request. Any microservice or server replica can verify the token independently using the shared secret key. Highly scalable.
  - **Trade-off (Revocation)**: Because the server does not track issued tokens, a valid token cannot be instantly revoked before it expires. If a user changes their password or is terminated, their token remains technically valid until its `exp` time arrives.
  - **Mitigation in VendorFlow**: We use **short-lived access tokens** (1 hour) and verify user `isActive` status in the database during `authMiddleware` to immediately block deactivated accounts.
- **Stateful Sessions**:
  - The server stores session IDs in memory or a database. Revocation is instantaneous (delete session row), but every single incoming request incurs database/cache I/O latency.

### Why Express Middleware Order Controls Execution
Express maintains an internal `stack` of middleware functions executed in strict linear FIFO order:
`req -> Middleware 1 -> Middleware 2 -> ... -> Route Handler -> Error Handler`

If a route is configured as:
```javascript
router.get('/admin-only', authMiddleware, roleMiddleware('Admin'), handler);
```
1. Express invokes `authMiddleware` first. It decodes the token and attaches `req.user`. If the token is invalid, it throws an error or returns HTTP 401, immediately terminating the chain.
2. `roleMiddleware` executes next. It inspects `req.user.role`. If the user is not an `Admin`, it terminates the chain with HTTP 403.
3. The route handler only executes if **both** prior guards called `next()`.
If the order were reversed (`roleMiddleware` before `authMiddleware`), `roleMiddleware` would check `req.user.role` before `req.user` even exists, causing an unhandled crash or false rejection. Middleware sequencing in Express is declarative security.

---

## 5. How to Manually Verify This Phase

1. **Verify Registration & Login for All 3 Roles**:
   - Start the app with `npm run dev` at the repository root.
   - Open `http://localhost:5173/register` and create accounts:
     - Name: `Jane Admin`, Email: `test.admin@test.com`, Password: `Password123!`, Role: `Admin` -> Lands on `/admin`.
     - Name: `John Buyer`, Email: `test.buyer@test.com`, Password: `Password123!`, Role: `Buyer` -> Lands on `/buyer`.
     - Name: `Sam Vendor`, Email: `test.vendor@test.com`, Password: `Password123!`, Role: `Vendor` -> Lands on `/vendor`.
   - Log out using the logout button in the top navigation.
   - Log in via `http://localhost:5173/login` using the demo buttons or registered credentials.

2. **Verify 401 Unauthorized (Without Token)**:
   In PowerShell or terminal:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:5000/api/dev/protected" -Method Get
   ```
   **Expected**: Returns HTTP 401 with message `"Not authorized: No authentication token provided"`.

3. **Verify 403 Forbidden (Role Mismatch)**:
   Login as a Vendor and attempt to call the admin-only route:
   ```powershell
   $login = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"vendor.apex@example.com","password":"Password123!"}'
   $token = $login.data.token
   Invoke-RestMethod -Uri "http://localhost:5000/api/dev/admin-only" -Headers @{Authorization="Bearer $token"}
   ```
   **Expected**: Returns HTTP 403 with message `"Forbidden: Role 'Vendor' is not authorized to access this resource"`.

4. **Verify httpOnly Cookie Transmission**:
   Log in with a web session that preserves cookies and query `/api/auth/me`:
   ```powershell
   $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
   Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@vendorflow.io","password":"Password123!"}' -WebSession $session
   Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -WebSession $session
   ```
   **Expected**: Successfully returns the authenticated user object using only the `httpOnly` cookie.

---

## 6. What Next Phase (Phase 3) Will Build on Top of This
With authentication and RBAC verified:
- **Phase 3: Vendor Registration & Profile Management**:
  - Multi-step onboarding wizard accessible to authenticated `Vendor` users.
  - File upload middleware using **Multer** for compliance certificates (GST, PAN, MSME).
  - Vendor profile CRUD controllers linked to the authenticated user's `owner` ID (`req.user.id`).
  - Validation checks for legal entity types, tax numbers, and IFSC bank codes.
