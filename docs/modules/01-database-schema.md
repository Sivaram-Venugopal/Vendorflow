# VendorFlow — Phase 1: Database Schema & Core Backend Foundation

## 1. Phase Overview
Phase 1 designs and establishes the comprehensive data domain models and backend foundational plumbing for VendorFlow. It transitions the application from a basic setup to an operational MERN data layer powered by **Mongoose ODM** and **MongoDB**.

In this phase, we:
- Engineered 5 core Mongoose schemas and models:
  1. `User`: Role-based authentication entities (`Admin`, `Buyer`, `Vendor`) with pre-save bcrypt password hashing.
  2. `Vendor`: Enterprise supplier entities with address, banking, categorized attributes, compliance score, and subdocument compliance records.
  3. `Evaluation`: Structured supplier performance scorecard reviews across 4 dimensions (Quality, Delivery, Pricing, Compliance).
  4. `PurchaseOrder`: PO lifecycle model with nested line items, tax/subtotal calculation hooks, delivery metadata, and status tracking.
  5. `AuditLog`: Immutable ledger tracking administrative events, PO updates, evaluations, and vendor state transitions.
- Defined explicit relationships via `ObjectId` references (`ref`).
- Built a central Express error-handling middleware that parses MongoDB and Mongoose errors (duplicate keys `11000`, `ValidationError`, `CastError`).
- Created an `asyncHandler` utility wrapper to eliminate repetitive `try/catch` boilerplate.
- Developed an idempotent database seed script (`server/src/utils/seed.js`) generating realistic sample data.
- Exposed a temporary `GET /api/dev/vendors` route that validates populated relationships between vendors and owners.

---

## 2. Request → Response Data Flow for `/api/dev/vendors`

```
[HTTP Client / Postman / Browser / Integration Test]
                     │
                     │ 1. GET /api/dev/vendors
                     ▼
[Express Server Pipeline]
                     │
                     │ 2. Global Middleware (cors, morgan, express.json)
                     ▼
[Route Router: server/src/routes/devRoutes.js]
                     │
                     │ 3. Matches GET /vendors -> getDevVendors
                     ▼
[Controller: server/src/controllers/devController.js]
  Wrapped with asyncHandler(fn)
                     │
                     │ 4. Executes Mongoose query:
                     │    Vendor.find({}).populate('owner', 'name email role department')
                     ▼
[MongoDB Engine]
                     │
                     │ 5. Executes query on `vendors` collection;
                     │    Performs join-lookup on `users` collection matching `owner` ObjectId.
                     ▼
[Mongoose Hydration]
                     │
                     │ 6. Hydrates documents into Vendor Mongoose instances with populated User data.
                     ▼
[HTTP Response: 200 OK]
{
  "status": "success",
  "count": 2,
  "message": "Temporary dev route for verifying seeded vendors (to be removed in Phase 7)",
  "data": [
    {
      "_id": "6acba33c595b9e940282cfb2",
      "companyName": "Apex Industrial Supplies Pvt Ltd",
      "taxId": "29ABCDE1234F1Z5",
      "panNumber": "ABCDE1234F",
      "owner": {
        "_id": "6acba33b595b9e940282cfa2",
        "name": "Rajesh Sharma (Vendor - Apex)",
        "email": "vendor.apex@example.com",
        "role": "Vendor"
      },
      ...
    }
  ]
}
```

If an invalid query, cast error, or unhandled rejection occurs during execution:
```
[asyncHandler] catches error -> passes to next(err) -> triggers central errorHandler middleware
-> formats standardized JSON response with appropriate HTTP status code (400, 409, or 500).
```

---

## 3. Key Files and Responsibilities

| File Path | Description |
|---|---|
| `server/src/models/User.js` | User schema with role enum (`Admin`, `Buyer`, `Vendor`), email regex validation, unique index, and bcrypt password hashing hook. |
| `server/src/models/Vendor.js` | Vendor schema with owner reference (`ObjectId` to User), business categorizations, embedded compliance documents, unique tax/PAN fields, and compound indexes. |
| `server/src/models/Evaluation.js` | Performance review schema linking vendor and evaluator User, score dimensions (1–5), automated overall score pre-save calculation. |
| `server/src/models/PurchaseOrder.js` | PO lifecycle schema with subdocument line items, automated subtotal/tax pre-save hooks, delivery schedules, and vendor/buyer refs. |
| `server/src/models/AuditLog.js` | Immutable event log with User ref, polymorphic entity tracking (`entityType`, `entityId`), action enum, and indexed timestamps. |
| `server/src/models/index.js` | Central barrel export exporting all 5 Mongoose models. |
| `server/src/utils/asyncHandler.js` | Utility wrapper function resolving promises and passing errors to Express `next(err)`. |
| `server/src/middleware/errorHandler.js` | Centralized error handler converting Mongoose `CastError`, duplicate key `11000`, and `ValidationError` into clean HTTP responses. |
| `server/src/utils/seed.js` | Database seeder that flushes existing data and inserts realistic interconnected users, vendors, evaluations, purchase orders, and audit records. |
| `server/src/controllers/devController.js` | Dev controller exposing `getDevVendors` with populated owner user. |
| `server/src/routes/devRoutes.js` | Router mounting dev endpoints under `/api/dev`. |

---

## 4. Internals & Architectural Decisions

### Document vs Relational Modeling
In relational databases (RDBMS), data is normalized into strict tables separated by foreign keys, requiring multi-table `JOIN` operations at read time. In document databases (MongoDB), data that is accessed together can be stored together as embedded documents, or referenced when relationships are unbound, many-to-many, or independently mutated.

In VendorFlow:
1. **Embedded Subdocuments**:
   - `Vendor.documents`: A vendor's compliance documents (GST certificate, PAN card) are always read and displayed in the context of that specific vendor. They do not exist independently of the vendor, so embedding them as subdocuments avoids unnecessary queries and keeps the document atomic.
   - `PurchaseOrder.items`: Purchase order line items are inextricably tied to the parent PO invoice. Embedding items directly inside the PO guarantees transactional atomicity (when a PO is created or edited, all items save in a single write operation).
2. **Referenced Documents (`ObjectId` with `ref`)**:
   - `Vendor -> User (owner)`: Users log in, reset passwords, and may manage access independently of vendor profile data. Referencing `User._id` ensures normalization of user credentials and roles.
   - `Evaluation -> Vendor & User (evaluator)`: A vendor accumulates many periodic evaluations over years. If evaluations were embedded inside the Vendor document, the vendor document could grow unboundedly, exceeding MongoDB's 16MB document size limit. Referencing keeps both collections clean and indexable.
   - `PurchaseOrder -> Vendor & User (buyer)`: Thousands of POs will be issued to a single vendor over time. Referencing `vendor` and `buyer` allows efficient pagination, aggregation, and querying from either perspective.
   - `AuditLog -> User & entity`: Audit logs are high-volume, append-only records. Referencing ensures zero bloat on domain models while maintaining a historical audit trail.

### What Mongoose Validates vs What MongoDB Enforces
- **Mongoose Validation (Application Level)**:
  - Validations defined in schema fields (e.g. `required`, `minlength`, `enum`, regex patterns, custom validators, pre-save hooks) are executed in Node.js **before** the write request reaches MongoDB.
  - If a required field is missing or an invalid enum value is submitted, Mongoose stops the query and returns a `ValidationError` without hitting the database wire.
- **MongoDB Enforcement (Database Engine Level)**:
  - **Unique Constraints (`unique: true`)**: This is **NOT** a Mongoose validator. When `unique: true` is set, Mongoose instructs MongoDB to create a unique B-tree index in the database engine. The uniqueness constraint is enforced strictly by MongoDB at storage level. If duplicate data is written concurrently, MongoDB rejects the write and emits error code `11000`.
  - **Type Coercion & Storage Limits**: MongoDB enforces physical storage rules (e.g. 16MB BSON document limit, valid BSON types).
  - Our centralized error handler bridges both levels: translating Mongoose application validation errors (`ValidationError`, `CastError`) as well as MongoDB engine errors (`E11000 duplicate key`).

### Why Indexes Matter for Fields like Vendor GST / PAN Numbers
1. **Query Performance ($O(N)$ vs $O(\log N)$)**:
   - Without an index, querying for a vendor by GSTIN or PAN requires a **Collection Scan (`COLLSCAN`)**, where MongoDB scans every document in the collection sequentially. For tens of thousands of vendors, this consumes significant CPU and I/O.
   - An index creates a sorted B-tree structure. Lookups by GST or PAN become an **Index Scan (`IXSCAN`)**, executing in logarithmic time ($O(\log N)$) with near-instant lookup.
2. **Uniqueness Enforcement**:
   - Both GSTIN and PAN are legal tax identifiers that must belong to at most one business entity. MongoDB uses the unique index to instantaneously verify that no other record exists with that identifier prior to writing, preventing duplicate registrations and race conditions.

---

## 5. How to Manually Verify This Phase

1. **Run the Database Seed Script**:
   From the repository root or server folder:
   ```bash
   cd server
   npm run seed
   ```
   **Expected Output**:
   ```text
   🌱 Starting VendorFlow Database Seeder...
   [MongoDB] Connected successfully: 127.0.0.1/vendorflow
   🧹 Purging existing collections...
   ✅ Cleared User, Vendor, Evaluation, PurchaseOrder, and AuditLog collections.
   👤 Seeding Users...
   ✅ Seeded 5 Users.
   🏢 Seeding Vendors...
   ✅ Seeded 2 Vendors.
   ⭐ Seeding Evaluations...
   ✅ Seeded 2 Evaluations.
   📦 Seeding Purchase Orders...
   ✅ Seeded 2 Purchase Orders.
   📝 Seeding Audit Logs...
   ✅ Seeded 3 Audit Logs.
   🎉 VendorFlow database seed successfully completed!
   ```

2. **Verify Collections in MongoDB**:
   In PowerShell or mongosh:
   ```powershell
   mongosh vendorflow --eval "db.getCollectionNames()"
   ```
   Expected collections: `users`, `vendors`, `evaluations`, `purchaseorders`, `auditlogs`.

3. **Verify Dev API Endpoint (`/api/dev/vendors`)**:
   Start the server (`npm run dev`) and test with curl or PowerShell:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:5000/api/dev/vendors"
   ```
   Verify that:
   - HTTP status is 200.
   - Returns 2 seeded vendors with embedded compliance documents.
   - The `owner` field is populated with the linked User's `name`, `email`, and `role`.

---

## 6. What Next Phase (Phase 2) Will Build on Top of This
With the schema models and database foundation operational:
- **Phase 2: Authentication & RBAC Engine**:
  - Implement JWT token generation (`generateToken(userId)`).
  - Build `authController` (`register`, `login`, `getMe`).
  - Implement `protect` middleware verifying Bearer tokens.
  - Implement `authorizeRoles('Admin', 'Buyer', 'Vendor')` middleware.
  - Wire Redux `authSlice` and login form on the client to store JWT and conditionally protect routes.
