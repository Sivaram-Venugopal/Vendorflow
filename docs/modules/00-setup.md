# VendorFlow — Phase 0: Project Setup & Environment Bootstrap

## 1. Phase Overview
Phase 0 establishes the foundation and architecture skeleton for **VendorFlow**, an enterprise-grade procurement portal covering vendor onboarding, vendor evaluation, and the purchase order lifecycle.

This phase implements:
- A clean, structured **Express.js backend** connected to **MongoDB** via **Mongoose** with clear boot and connection logging.
- A **Vite + React frontend** configured with **Tailwind CSS**, **React Router**, **Redux Toolkit**, and **Axios**.
- A responsive layout with top navigation, side navigation, routed placeholder pages (`/login`, `/admin`, `/buyer`, `/vendor`), and a live `Connected to API` status indicator checking `/api/health`.
- Unified development scripts and comprehensive environment variable documentation.

---

## 2. Request → Response Data Flow for `/api/health`

```
[Client: ApiHealthIndicator / Redux fetchHealthStatus]
                      │
                      │ 1. HTTP GET /api/health
                      ▼
[Express Server (server/src/server.js: port 5000)]
                      │
                      │ 2. Middleware Pipeline (CORS, Morgan, JSON parser)
                      ▼
[Routes: server/src/routes/healthRoutes.js]
                      │
                      │ 3. Delegates to controller
                      ▼
[Controller: server/src/controllers/healthController.js]
                      │
                      │ 4. Reads mongoose.connection.readyState (0=disconnected, 1=connected, etc.)
                      │    Reads process.uptime(), environment variables
                      ▼
[Mongoose / MongoDB Driver]
                      │
                      │ 5. Returns connection state
                      ▼
[HTTP Response: 200 OK / 503 Service Unavailable]
{
  "status": "healthy",
  "service": "VendorFlow API",
  "uptime": 24,
  "timestamp": "2026-10-11T14:28:43.092Z",
  "database": {
    "status": "connected",
    "name": "vendorflow",
    "host": "127.0.0.1"
  },
  "environment": "development"
}
                      │
                      │ 6. Axios receives response & dispatches fulfilled action
                      ▼
[Redux Store: healthSlice.js]
  -> state.status = "succeeded"
  -> state.data = response.data
                      │
                      │ 7. useSelector triggers re-render
                      ▼
[UI Component: ApiHealthIndicator.jsx]
  -> Displays green indicator: "Connected to API (DB: connected)"
```

---

## 3. Key Files and Responsibilities

| File Path | Description |
|---|---|
| `package.json` | Root workspace orchestrator with `npm run dev` running backend and frontend concurrently. |
| `.gitignore` | Ignores `node_modules`, local `.env` files, build outputs (`dist/`), and OS artifacts. |
| `.env.example` | Root template declaring necessary environment variables for server and client. |
| `server/src/server.js` | Server bootstrapper. Loads `.env`, calls `connectDB()`, and starts HTTP server on port 5000. |
| `server/src/app.js` | Express application instance configuring CORS, morgan logging, json parsing, and route mounts. |
| `server/src/config/db.js` | Mongoose MongoDB connection handling with clean host/database boot logging and error handling. |
| `server/src/controllers/healthController.js` | Computes API uptime and live MongoDB readiness status (`0`, `1`, `2`, `3`). |
| `server/src/routes/healthRoutes.js` | Express router exposing the `GET /api/health` endpoint. |
| `server/src/middleware/errorHandler.js` | Express middleware handling 404 Not Found and formatting 500 errors into clean JSON. |
| `client/src/main.jsx` | React DOM entry point wrapping App with Redux `Provider` and React Router `BrowserRouter`. |
| `client/src/App.jsx` | Defines route definitions (`/`, `/login`, `/admin`, `/buyer`, `/vendor`, `*`). |
| `client/src/layouts/BaseLayout.jsx` | Top navigation bar with branding & health indicator, sidebar with page links, and main content outlet. |
| `client/src/components/ApiHealthIndicator.jsx` | Polls `/api/health` every 30s with pulsing status indicator and manual reload button. |
| `client/src/store/slices/healthSlice.js` | Redux slice managing async health status check via `createAsyncThunk`. |
| `client/src/api/axiosClient.js` | Central Axios instance configured with `baseURL` from Vite environment variables. |
| `client/tailwind.config.js` | Tailwind CSS configuration with custom theme tokens. |

---

## 4. Plain-Language Engineering Explanations

### How Express Middleware Chains Work
Express processes incoming HTTP requests through an ordered pipeline of functions called **middleware**. Each middleware function receives three arguments: `req` (incoming request), `res` (outgoing response), and `next` (function that forwards control to the next middleware in line).

1. When a client makes a request, it first hits global middleware like `cors()` (validating allowed origins and HTTP methods) and `morgan()` (logging the HTTP request to the terminal).
2. The request passes down the chain via `next()`.
3. If a route matches (e.g., `/api/health`), the route handler handles the request and sends the response (`res.json()`), which terminates the chain.
4. If no route matches, the execution falls through to the `notFound` middleware, which instantiates an Error and invokes `next(error)`.
5. Error-handling middleware in Express is identified by accepting four arguments: `(err, req, res, next)`. Whenever `next(error)` is triggered, Express bypasses all remaining regular middleware and directly invokes the error handler to return a standardized JSON error response.

### What the MongoDB Connection String Encodes
A standard MongoDB URI looks like:
`mongodb://127.0.0.1:27017/vendorflow`
or in production with authentication and replica sets:
`mongodb://<username>:<password>@cluster0.mongodb.net:27017/vendorflow?retryWrites=true&w=majority`

This string encodes:
1. **Protocol (`mongodb://` or `mongodb+srv://`)**: Specifies the wire protocol and connection format (`srv` enables DNS seed lists).
2. **Authentication (`username:password@`)**: Credentials used to authenticate against the target auth database.
3. **Host and Port (`127.0.0.1:27017`)**: The IP address or domain name and port where the `mongod` daemon listens for incoming TCP sockets.
4. **Target Database (`/vendorflow`)**: The initial default database context that Mongoose uses to read and write collections.
5. **Connection Options (`?retryWrites=true&w=majority`)**: Query parameters configuring behavior such as write concern, timeouts, and replica sets.

### How Vite's Dev Server & React Router Client-Side Routing Work
- **Vite Dev Server**: Unlike legacy bundlers (like Webpack) that bundle the entire codebase upfront before serving, Vite leverages native ES Modules (`<script type="module">`). During development, Vite serves source code over native ESM, only compiling and transforming files on-demand as they are requested by the browser. Hot Module Replacement (HMR) operates near-instantaneously because Vite only needs to invalidate and re-deliver the single modified module.
- **Client-Side Routing with React Router**: In a Single Page Application (SPA), the browser only loads a single HTML file (`index.html`). When a user clicks a link (such as `/admin`), React Router intercepts the browser's default navigation event using the HTML5 History API (`window.history.pushState`). The page does not reload from the server. Instead, React Router evaluates the URL path against the registered `<Route>` components and mounts the appropriate React component (`AdminPage`) directly into `<Outlet />`.

---

## 5. How to Manually Verify This Phase

1. **Verify Database**:
   Ensure MongoDB service is running:
   ```powershell
   Get-Service -Name "*mongo*"
   ```
2. **Start Development Servers**:
   From repository root:
   ```bash
   npm run dev
   ```
   Or independently:
   - Server: `cd server && npm run dev` (starts on `http://localhost:5000`)
   - Client: `cd client && npm run dev` (starts on `http://localhost:5173`)
3. **Verify API Health Endpoint**:
   Open browser or terminal:
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected response: Status 200, `"status": "healthy"`, `"database": { "status": "connected" }`.
4. **Verify Client UI & Routing**:
   - Open `http://localhost:5173` in a browser.
   - Confirm the top right header displays a green pulse and text: **"Connected to API (DB: connected)"**.
   - Click the sidebar links: **Admin Portal**, **Buyer Workspace**, **Vendor Workspace**, **Login**. Verify each route updates the URL and renders the corresponding view without page refreshes.

---

## 6. What Next Phase (Phase 1) Will Build on Top of This
With the MERN foundation verified:
- **Phase 1: Authentication & RBAC (Role-Based Access Control)** will implement:
  - User model schema with Mongoose (`name`, `email`, `password`, `role` enum: `Admin`, `Buyer`, `Vendor`).
  - Password hashing with `bcryptjs`.
  - JWT creation and verification middleware (`protect`, `authorizeRoles`).
  - Auth controllers for registration, login, and `/api/auth/me`.
  - Redux `authSlice` to persist tokens in localStorage and manage user sessions.
  - Protected route wrappers (`ProtectedRoute`) in the client to restrict access to `/admin`, `/buyer`, and `/vendor` based on user roles.
