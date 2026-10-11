# VendorFlow — Phase 3: Vendor Onboarding Module

## 1. Phase Overview
Phase 3 builds the self-serve **Vendor Onboarding & KYC Governance Engine** for VendorFlow. It enables supplier companies to register their corporate profiles, upload required statutory documents (GST certificate, PAN card, MSME, banking checks), and trace their onboarding status in real-time, while equipping administrators with a centralized review desk to inspect documents and issue approvals or rejections with audit trails.

In this phase, we:
- Built `POST /api/vendors`: Vendor self-registration endpoint setting initial status to `Pending` and linking the entity to `req.user.id`.
- Configured a **Multer-based disk storage pipeline** for KYC file uploads (`POST /api/vendors/documents`), generating collision-free filenames, enforcing 10MB limits and MIME-type restrictions (PDF, PNG, JPG), and recording file references/URLs directly on the `Vendor.documents` subdocument array without storing bloated binary blobs in MongoDB.
- Created `GET /api/vendors`: Admin/Buyer queue endpoint supporting query filtering by status (`Pending`, `Approved`, `Rejected`), category, and search terms.
- Created `GET /api/vendors/me`: Dedicated profile lookup for the authenticated vendor session.
- Implemented `PATCH /api/vendors/:id/status`: Admin approval/rejection endpoint recording status transitions, audit remarks (`statusReason`), and triggering an event notification stub.
- Integrated an event notification stub (`server/src/utils/notificationStub.js`) logging dispatched alerts to prepare for Nodemailer integration in Phase 8.
- Developed UI components:
  1. **Multi-step Onboarding Wizard** (`VendorOnboardingWizard.jsx`): Company Info -> Document Staging -> Submission Review.
  2. **Pending Vendors Queue** (`PendingVendorsQueue.jsx`): Table with document preview modal, quick review actions, and optimistic UI updates.
  3. **Vendor Status Tracker Banner** (`VendorStatusBanner.jsx`): Real-time visual indicator reflecting `Pending`, `Approved`, `Rejected`, or `Under Review` states without requiring manual page reloads.

---

## 2. Request → Response Data Flow for Vendor Onboarding & Document Upload

### A. Document Upload Flow (Multipart Form-Data)
```
[Vendor uploads GSTIN Certificate PDF in UI]
                  │
                  │ 1. POST /api/vendors/documents
                  │    Headers: Content-Type: multipart/form-data; boundary=----WebKit...
                  │    Body: form fields (documentType='GST_CERTIFICATE', file=<binary stream>)
                  ▼
[Express Server Pipeline]
                  │
                  ▼
[Middleware: authMiddleware] -> Decodes JWT, attaches req.user (Vendor)
                  │
                  ▼
[Middleware: uploadKYCDocument.single('file')]
  ├─► Inspects Content-Type boundary and streams incoming chunks
  ├─► fileFilter verifies extension (.pdf, .jpg, .png) and mimetype
  ├─► diskStorage writes file to uploads/documents/gst_cert-1791733648-458105.pdf
  ├─► Attaches metadata to req.file: { filename, path, size, mimetype, originalname }
  └─► Passes control to next()
                  │
                  ▼
[Controller: uploadDocument]
  ├─► Resolves target vendor: Vendor.findOne({ owner: req.user._id })
  ├─► Generates public URI: '/uploads/documents/' + req.file.filename
  ├─► vendor.documents.push({ documentType, documentUrl, fileName, uploadedAt, verified })
  ├─► Re-evaluates vendor.complianceScore
  ├─► vendor.save()
  ├─► Records event in AuditLog collection
  ▼
[HTTP 200 OK Response]
{
  "status": "success",
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "documentType": "GST_CERTIFICATE",
      "documentUrl": "/uploads/documents/gst_cert-1791733648-458105.pdf",
      "fileName": "gst_cert.pdf",
      "verified": false
    },
    "complianceScore": 70,
    "totalDocuments": 1
  }
}
```

### B. Admin Status Transition & Notification Flow
```
[Admin clicks "Approve" or "Reject" with audit reason]
                  │
                  │ 1. Optimistic UI update in Redux store (instant UI status change)
                  │ 2. PATCH /api/vendors/:id/status
                  ▼
[Middleware: authMiddleware + roleMiddleware('Admin')]
                  │
                  ▼
[Controller: updateVendorStatus]
  ├─► Vendor.findById(id)
  ├─► Updates vendor.status = 'Approved', vendor.statusReason = reason
  ├─► Sets doc.verified = true for all attached documents
  ├─► vendor.save()
  ├─► AuditLog.create({ action: 'VENDOR_APPROVED', entityId: vendor._id, ... })
  ├─► notifyVendorStatusChange({ vendorId, vendorName, status, reason, updatedBy })
  ▼
[HTTP 200 OK + Server Confirmation]
  Client Redux store confirms state and keeps UI in sync without reload.
```

---

## 3. Key Files and Responsibilities

| File Path | Description |
|---|---|
| `server/src/middleware/uploadMiddleware.js` | Configures Multer disk storage, clean unique filename generator, MIME filter (PDF/PNG/JPG), and 10MB file limit. |
| `server/src/controllers/vendorController.js` | Controllers for vendor self-registration, KYC file metadata storage, admin queue retrieval with filters, and status patching. |
| `server/src/routes/vendorRoutes.js` | Express router exposing `/api/vendors`, `/documents`, `/me`, and `/:id/status` protected by `authMiddleware` and `roleMiddleware`. |
| `server/src/utils/notificationStub.js` | Notification service stub logging vendor status transition events to the console (ready for Nodemailer in Phase 8). |
| `server/src/app.js` | Serves `/uploads` as a static directory (`express.static`) and mounts `/api/vendors`. |
| `client/src/store/slices/vendorSlice.js` | Redux slice managing vendor queue, active profile state, KYC uploads, and optimistic UI updates (`setVendorStatusOptimistic`). |
| `client/src/components/VendorStatusBanner.jsx` | Dynamic vendor status tracker displaying status color badge, audit remarks, and compliance rating. |
| `client/src/components/VendorOnboardingWizard.jsx` | Multi-step registration wizard (Company Info -> Staged Documents -> Review & Submit). |
| `client/src/components/PendingVendorsQueue.jsx` | Admin approval queue table with KYC document preview modal and approve/reject decision actions. |
| `client/src/pages/AdminPage.jsx` | Admin governance dashboard containing queue metrics, status filter buttons, search bar, and `PendingVendorsQueue`. |
| `client/src/pages/VendorPage.jsx` | Vendor workspace displaying real-time status banner, company details, compliance documents, and document upload actions. |

---

## 4. Internals & Architectural Decisions

### How `multipart/form-data` Differs from JSON and How Multer Parses It
- **`application/json`**:
  - The request payload is a single UTF-8 encoded text string representing a JSON object.
  - Efficient for structured text, numbers, and booleans.
  - Binary files must be base64-encoded, which increases payload size by ~33% and requires buffering the entire file in Node.js memory before parsing.
- **`multipart/form-data`**:
  - The request payload is divided into separate "parts" delineated by a unique MIME boundary string specified in the `Content-Type` header (e.g. `boundary=----WebKitFormBoundary...`).
  - Each part contains its own mini-headers (`Content-Disposition: form-data; name="file"; filename="gst.pdf"`, `Content-Type: application/pdf`) followed by the raw binary stream of the file.
  - Text fields and multiple binary files can be transmitted simultaneously.
- **How Multer Parses It**:
  - Express's built-in `express.json()` and `express.urlencoded()` middlewares deliberately ignore `multipart/form-data` requests.
  - Multer attaches a streaming parser (built on `busboy`) to the incoming Node.js `IncomingMessage` stream.
  - It reads the boundary markers chunk by chunk, streaming file buffers directly to disk (`diskStorage`) without exhausting server RAM, and populates `req.body` with text fields and `req.file` with file metadata.

### Why File Storage is Kept Separate from File Metadata
In VendorFlow, documents are stored on disk (or in cloud object storage like AWS S3 / Google Cloud Storage in production), and only **metadata** (`documentUrl`, `fileName`, `documentType`, `uploadedAt`) is stored on the MongoDB document.

1. **MongoDB 16MB Document Size Limit**: Storing raw binary files (BSON `BinData` or GridFS) inside a Mongoose document rapidly exceeds the 16MB limit, especially when multiple PDFs are attached.
2. **Database Memory & Cache Efficiency**: Databases keep frequently accessed documents in RAM (WiredTiger cache). Bloating vendor records with megabytes of binary data would flush active query indexes out of memory and severely degrade throughput.
3. **Optimized Static Delivery**: Static file servers, CDNs (Cloudflare, AWS CloudFront), and web servers (Nginx) are specifically optimized to stream static files using kernel-level `sendfile()` calls with zero Node.js CPU overhead. Storing binaries in MongoDB would force Node.js to read chunks from the database and stream them over HTTP.

### When Optimistic UI Updates are Appropriate vs Waiting for the Server
- **Appropriate for Optimistic UI**:
  - **Low-risk status toggles and administrative actions**: When an Admin clicks "Approve" or "Reject", the action has a 99.9% probability of succeeding on the server.
  - **Instant Feedback**: Updating the local Redux state immediately (`setVendorStatusOptimistic`) makes the interface feel instantaneous and eliminates perceived latency.
  - **Seamless Rollback**: If the server call rejects (e.g. network timeout or 403 error), the catch block can rollback the state and display an error toast.
- **Waiting for Server Confirmation**:
  - **High-stakes financial or transactional actions**: Payment processing, purchase order authorizations, or final contract signatures should **never** be updated optimistically.
  - **Operations with Unknown Server-Generated Data**: When creating a brand-new entity where the client does not yet know the generated MongoDB `_id` or unique invoice number, the UI must display a loading spinner until the server returns the canonical record.

---

## 5. How to Manually Verify This Phase

1. **Vendor Self-Registration**:
   - Register or login as a Vendor user (`http://localhost:5173/login`).
   - Navigate to `/vendor`. If not onboarded, click **Launch Onboarding Wizard**.
   - Step 1: Fill in company details, GSTIN (`29ABCDE1234F1Z5`), PAN (`ABCDE1234F`), and registered city.
   - Step 2: Stage a compliance document (PDF or image).
   - Step 3: Review details and click **Submit for Admin Approval**.
   - **Verification**: You are immediately transitioned to the **Vendor Profile** view displaying the yellow **"Onboarding Review in Progress"** banner (`status: Pending`).

2. **Admin Review Queue & Document Inspection**:
   - Logout and login as Admin (`admin@vendorflow.io` / `Password123!`).
   - Navigate to `/admin`.
   - In the **Vendor Onboarding Queue**, find the newly submitted vendor application.
   - Click the **Files** button or **Inspect** eye icon.
   - In the modal, verify company tax details and click **Preview Document** to open the uploaded file in a new tab.

3. **Status Update & Live Reflection (Without Page Reload)**:
   - In the modal, enter approval remarks (e.g., `"Verified GSTIN and PAN via government portal"`) and click **Approve & Onboard**.
   - The queue row updates immediately to green **"Approved"** badge.
   - In the backend terminal, verify the notification stub log:
     ```text
     🔔 [NOTIFICATION STUB] Vendor Status Update Dispatched
     🏢 Vendor: Acme Tech Solutions Pvt Ltd
     📌 New Status: [Approved]
     📝 Reason: Verified GSTIN and PAN via government portal
     ```
   - Log back into the Vendor workspace (`/vendor`): verify the banner immediately renders green **"Vendor Approved & Active"** without any page reload.

---

## 6. What Next Phase (Phase 4) Will Build on Top of This
With vendor onboarding and governance operational:
- **Phase 4: Item Catalog & Requisition Management**:
  - Item catalog schema (`Item`) with SKU, description, unit price, category, and preferred vendor link.
  - Requisition schema (`Requisition`) allowing buyers to draft purchase requests from the catalog.
  - Requisition approval workflows before conversion into formal Purchase Orders.
