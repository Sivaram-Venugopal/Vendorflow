# VendorFlow — Phase 6: Notifications & Audit Log Module

## 1. Phase Overview
Phase 6 implements the **Enterprise Notifications & Immutable Audit Logging System** for VendorFlow. It connects commercial actions—vendor approvals/rejections, performance scorecard evaluations, and purchase order lifecycle transitions—to real-time event dispatching, automated test email generation, and tamper-resistant audit trails.

In this phase, we:
- Built a **Nodemailer email transport service** (`server/src/utils/mailer.js`) supporting automated Ethereal test SMTP accounts in development/testing and standard production SMTP servers via environment variables.
- Wired automated email notifications that fire on:
  1. **Vendor Approval & Rejection** (`sendVendorStatusEmail`)
  2. **Vendor Evaluation Scorecards** (`sendEvaluationEmail`)
  3. **Purchase Order State Transitions** (`sendPOStatusChangeEmail`)
  Every dispatched email outputs a live preview URL on ethereal.email for browser inspection.
- Architected **ONE centralized, reusable audit logging helper** (`server/src/utils/auditLogger.js`), replacing scattered, duplicative per-controller logging code with a unified, standard interface capturing who, what, when, before/after states, metadata, and client fingerprints (IP, User-Agent).
- Updated the **`AuditLog` Mongoose schema** (`server/src/models/AuditLog.js`) with immutable timestamps, `beforeState` and `afterState` snapshot diffing, and indexed search keys.
- Implemented **`GET /api/audit-logs`** (`server/src/controllers/auditLogController.js`), an Admin-exclusive endpoint filterable by entity domain, entity ID, actor name/ID, action type, date range, and free-text search.
- Created an **in-app notification tracking system** (`server/src/models/Notification.js`, `server/src/controllers/notificationController.js`, `server/src/routes/notificationRoutes.js`) with endpoints for polling unread alerts, marking as read, and querying recent test email URLs.
- Developed frontend monitoring suites:
  1. **Admin Activity Log View** (`AdminActivityLog.jsx`): Comprehensive audit table with multi-criteria filters, state transition pills (Before &rarr; After), clickable Ethereal preview links, and a side-by-side JSON state diff inspector modal.
  2. **Notification Center & Floating Toast** (`NotificationCenter.jsx`): Top navbar bell icon with dynamic unread counter, dropdown menu, direct test email preview triggers, 12-second periodic polling, and animated in-app slide-in toast notifications.

---

## 2. Request → Response Data Flow for Notifications & Audits

```
[Buyer or Admin triggers state-changing action in UI]
(e.g., PATCH /api/purchase-orders/:id/status -> "Sent")
                         │
                         ▼
[Target Controller: transitionPOStatus]
  ├─► Validates FSM transition and user authorization
  ├─► Saves PO updates to MongoDB
  │
  ├─► 1. Nodemailer Email Dispatch:
  │      sendPOStatusChangeEmail({ po, fromStatus, toStatus, remarks, recipientEmail })
  │      - Transports MIME email via Ethereal SMTP
  │      - Captures messageId and live preview URL:
  │        https://ethereal.email/message/<id>
  │
  ├─► 2. Centralized Audit Logger Helper:
  │      logAudit(req, {
  │        action: 'PO_STATUS_UPDATED',
  │        entityType: 'PurchaseOrder',
  │        entityId: po._id,
  │        beforeState: { status: 'Approved' },
  │        afterState: { status: 'Sent' },
  │        details: { poNumber, fromStatus, toStatus, emailPreviewUrl },
  │        notify: { targetRole: 'Vendor', title: 'PO Sent', message: '...', emailPreviewUrl }
  │      })
  │      - Persists immutable write-once AuditLog document
  │      - Persists in-app Notification document
  │
  └─► Returns HTTP 200 OK with mutated entity
                         │
                         ▼
[Frontend Polling & UI Reflection]
  ├─► Client NotificationCenter polls GET /api/notifications every 12s
  │    -> Unread badge increments
  │    -> Floating in-app toast slides into view with clickable "Open Ethereal Test Email ↗"
  └─► Admin opens "Activity Log" tab (GET /api/audit-logs)
       -> Instant row displaying Who, Action, Before->After diff, and Ethereal Email link
```

---

## 3. Key Files and Responsibilities

| File Path | Description |
|---|---|
| `server/src/utils/mailer.js` | Nodemailer transporter service with automated Ethereal dev accounts, HTML email templates, and helper functions (`sendVendorStatusEmail`, `sendEvaluationEmail`, `sendPOStatusChangeEmail`). |
| `server/src/utils/auditLogger.js` | Single reusable audit helper (`logAudit`) capturing actor, action, entity, before/after snapshots, IP, user-agent, and dispatching in-app notifications. |
| `server/src/models/AuditLog.js` | Mongoose schema featuring `beforeState`, `afterState`, `details`, IP, user-agent, and compound indexes with `{ createdAt: true, updatedAt: false }`. |
| `server/src/models/Notification.js` | Mongoose schema storing in-app alerts, target roles, read state, and Ethereal email preview URLs. |
| `server/src/controllers/auditLogController.js` | Admin-only controller for querying audit activity with multi-criteria filters (entity, actor, action, date range) and pagination. |
| `server/src/routes/auditLogRoutes.js` | Express router exposing `/api/audit-logs`, guarded by `authMiddleware` and `roleMiddleware('Admin')`. |
| `server/src/controllers/notificationController.js` | Express controller providing user-scoped notification polling, mark-as-read mutations, and recent email dispatches. |
| `server/src/routes/notificationRoutes.js` | Router exposing `/api/notifications` endpoints. |
| `client/src/store/slices/auditLogSlice.js` | Redux Toolkit slice managing audit log fetching, filters, pagination, and selected log inspection. |
| `client/src/store/slices/notificationSlice.js` | Redux slice managing notification polling, unread counts, mark-as-read, and active toast state. |
| `client/src/components/AdminActivityLog.jsx` | Admin UI component featuring filter toolbar, audit table, action color tokens, Ethereal test email buttons, and before/after diff inspector. |
| `client/src/components/NotificationCenter.jsx` | Header notification bell with unread badge, dropdown drawer, 12s periodic poller, and animated slide-in toast alerts. |
| `client/src/layouts/BaseLayout.jsx` | Updated to render `NotificationCenter` in sticky top navigation. |
| `client/src/pages/AdminPage.jsx` | Updated to feature the "Activity Log" tab alongside Onboarding, PO Approvals, and Tiers. |

---

## 4. Internals & Architectural Decisions

### 1. How SMTP Sending Works from Node and Why Credentials Live in Environment Variables Only
- **How SMTP Sending Works in Node.js**:
  Simple Mail Transfer Protocol (SMTP) is a stateful text-based network protocol over TCP (typically ports 587 with STARTTLS or 465 with SSL/TLS). When Node sends an email via `nodemailer.createTransport()`:
  1. Node initiates a TCP connection to the remote mail exchange server.
  2. The server responds with `220 Service Ready`.
  3. Node sends `EHLO` to announce itself, followed by `STARTTLS` to negotiate TLS encryption.
  4. Node transmits Base64-encoded authentication credentials (`AUTH LOGIN`).
  5. Node streams the MIME-encoded message envelope (`MAIL FROM`, `RCPT TO`, `DATA`), terminating with `<CRLF>.<CRLF>`.
  6. The server accepts the message (`250 OK: queued as ...`), and Nodemailer resolves the promise with delivery confirmation.
  
  In development and testing, VendorFlow leverages **Ethereal Mail** (`nodemailer.createTestAccount()`). Ethereal acts as a real SMTP sink that accepts mail transfers without delivering to real human recipients, generating a secure web preview URL (`nodemailer.getTestMessageUrl(info)`) for forensic inspection.

- **Why Credentials Live in Environment Variables Only**:
  1. **Source Code Exposure (Git Leak Prevention)**: Hardcoding SMTP credentials (`user`, `pass`, `host`) in code repositories risks immediate credential exfiltration if code is pushed to public remotes or shared among developers.
  2. **12-Factor App Compliance**: Principle III ("Config") dictates strict separation of configuration from code. Changing email providers (e.g., from dev Ethereal to staging SendGrid to production AWS SES) requires only updating `.env` variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`) without altering a single line of backend logic or invalidating Docker image caches.
  3. **Blast Radius Isolation**: Different deployment environments require isolated email rate limits and security boundaries. Storing secrets in environment variables ensures development credentials can never access production mail relays.

---

### 2. Why Write-Once Audit Logging Beats Reconstructing History from Current State
Reconstructing historical events by examining current document state (e.g., looking at `vendor.status === 'Approved'` or `vendor.overallRating === 4.4`) fails critical compliance and operational requirements:
- **Destructive Mutation**: Overwriting a status or rating field erases what the value was immediately before the change. If a vendor transitions from `Approved` &rarr; `Suspended` &rarr; `Approved`, current state tells you they are approved, but completely hides that they were ever suspended or why.
- **Lost Attribution**: Current state records what the entity is now, but cannot prove *who* performed each intermediate step, *when* each transition occurred, or from what *IP address* and *device* the request originated.
- **Non-Repudiation**: In statutory procurement, suppliers and buyers may dispute agreed prices, delivery timestamps, or rejection rationales. Reconstructed history is legally defensible only when recorded by an append-only, tamper-evident logger.

VendorFlow enforces **write-once audit logging** via `server/src/models/AuditLog.js`:
```js
{
  timestamps: { createdAt: true, updatedAt: false } // Immutable: updatedAt is disabled
}
```
Every state-changing event writes:
1. `user`: authenticated user ID
2. `action`: state-changing verb (`VENDOR_APPROVED`, `PO_STATUS_UPDATED`, etc.)
3. `beforeState`: complete snapshot of relevant attributes prior to mutation
4. `afterState`: complete snapshot of relevant attributes after mutation
5. `details`: business context, remarks, and email preview links
6. `ipAddress` and `userAgent`: network provenance

Once inserted, audit records are strictly immutable. MongoDB queries cannot mutate or overwrite past entries.

---

### 3. The Polling-vs-WebSockets Trade-off and Why This Phase Chose Polling
When architecting real-time notifications in web applications, engineers evaluate two primary patterns:

| Architectural Metric | HTTP Short Polling | Persistent WebSockets (`ws://`) |
|---|---|---|
| **Protocol Overhead** | Standard HTTP/1.1 or HTTP/2 `GET` requests with TLS negotiation. | Single initial HTTP handshake upgraded to long-lived bidirectional TCP socket. |
| **Server State & Memory** | **Stateless**: Connections open, execute in ~10ms, and close. Zero persistent memory allocated per connected client. | **Stateful**: Node process must maintain an open TCP socket in memory for every connected tab. |
| **Horizontal Scalability** | **Trivial**: Stateless requests balance across any number of Node cluster processes or load balancers without shared session state. | **Complex**: Requires a Redis Pub/Sub backplane (or socket.io redis adapter) to fan out events across multiple server nodes. |
| **Firewall & Proxy Traversal** | **100% Reliable**: Traverses corporate proxies, firewalls, and cloud CDNs without special websocket upgrade routing. | Can fail behind aggressive corporate proxies that terminate or timeout idle WebSocket tunnels. |
| **Latency** | Bounded by poll frequency ($\sim 12\text{ seconds}$). | Sub-millisecond instant push. |

- **Why Phase 6 Chose Polling**:
  1. **Procurement Workflow Cadence**: Business procurement is not a high-frequency trading platform or a multiplayer game. Vendor approvals, PO releases, and supplier scorecard audits happen on a scale of minutes, hours, or days. A 12-second latency window is virtually instantaneous for human procurement officers while imposing negligible CPU load.
  2. **Stateless Simplicity & Architecture Cleanliness**: Implementing WebSockets at this stage would introduce stateful socket lifecycles, reconnect backoff loops, and authentication token refresh headaches across long-lived sockets. Polling relies on existing, rock-solid JWT authentication cookies and standard Express routers.
  3. **Zero Additional Infrastructure**: Polling runs directly against existing Mongoose queries with zero Redis or external message brokers required.

---

## 5. How to Verify

### 1. Automated Backend & Nodemailer Verification
Execute the standalone test script:
```powershell
node server/test_phase6.js
```
**Expected Output**:
- Initializes Ethereal Test SMTP server.
- Dispatches Vendor Status email and outputs live Ethereal Preview URL.
- Dispatches Performance Evaluation email with Ethereal Preview URL.
- Dispatches Purchase Order Transition email with Ethereal Preview URL.
- Writes 3 corresponding `logAudit` records and generates in-app notifications.

### 2. End-to-End API Test Script
Execute the full API test script:
```powershell
powershell -ExecutionPolicy Bypass -File server/test_phase6_api.ps1
```
**Expected Output**:
- Admin logs in (`admin@vendorflow.io`).
- Buyer logs in (`buyer@vendorflow.io`).
- Admin updates vendor status (`/api/vendors/:id/status`) &rarr; Ethereal email created.
- Buyer submits evaluation (`/api/evaluations`) &rarr; Ethereal email created.
- Admin queries `GET /api/audit-logs` &rarr; Retrieves entries with `beforeState`, `afterState`, and email preview links.
- Non-admin calling `GET /api/audit-logs` returns `HTTP 403 Forbidden`.

### 3. Full UI Verification via Browser
1. **Login as Admin** (`admin@vendorflow.io` / `Password123!`):
   - Navigate to **Admin Portal**.
   - Click the new **Activity Log** tab.
   - Observe the filter toolbar (Entity Domain, Action Type, Actor, Search keywords, Date range).
   - In the table, observe the **State Transition** column (`Pending` &rarr; `Approved`) and click **Diff** to inspect the side-by-side JSON comparison modal.
   - Click the blue **Ethereal Test Email ↗** link on any row to open the live email rendered in your browser.
2. **In-App Notifications & Toast Alerts**:
   - Observe the notification bell icon in the top header.
   - Click the bell to open the drawer displaying recent alerts with relative timestamps and direct email links.
   - In another tab or via a Buyer action, submit an evaluation or update a PO.
   - Within 12 seconds, observe the slide-in animated floating toast appear in the bottom-right corner!

---

## 6. Next-Phase Hooks (Phase 7: Vendor Fulfillment & Delivery Tracking)
Phase 7 implements goods delivery management and physical order reconciliation:
1. **Goods Receipt Note (GRN) Generation**: Wire delivery confirmations to automated GRN document generation.
2. **Delivery Milestone Audit Logs**: Use `logAudit` to track carrier dispatch notices, bill-of-lading entries, and item defect deductions.
3. **Delivery Alert Triggers**: Dispatch Nodemailer delivery notifications directly to receiving dock managers.
