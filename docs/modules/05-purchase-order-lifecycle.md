# VendorFlow — Phase 5: Purchase Order Lifecycle Module

## 1. Phase Overview
Phase 5 implements the **End-to-End Purchase Order (PO) Lifecycle & Finite State Machine (FSM)** for VendorFlow. It transitions commercial procurement agreements from static data records into a strictly controlled state machine where line items, taxes, and supplier commitments evolve through governed workflows.

In this phase, we:
- Built a **pure, unit-testable Finite State Machine (FSM) engine** (`server/src/utils/poStateMachine.js`) enforcing the full lifecycle: `Draft -> Pending Approval -> Approved -> Sent -> Acknowledged -> Delivered -> Invoiced -> Closed` (plus `Rejected`, `Declined`, and `Cancelled` branches). Illegal status jumps are blocked and rejected with HTTP 400.
- Implemented **role-gated status permissions** ensuring that only authorized actors can trigger specific transitions (e.g., only Admin/Buyer submit for approval, only Admin approves/rejects, only the assigned Vendor acknowledges/declines, only Buyer/Admin closes).
- Designed an **append-only history subdocument array** on the `PurchaseOrder` model (`server/src/models/PurchaseOrder.js`), recording every transition with previous state, target state, actor ObjectId, actor name, actor role, optional remarks, and immutable timestamps.
- Added **automated financial calculations** computing subtotal, 18% GST tax, and total gross value across dynamic line items via pre-save hooks and controller logic.
- Built **role-scoped querying** in `purchaseOrderController.js` ensuring Vendors can only see purchase orders assigned to their company entity, while hiding unreleased internal drafts (`Draft`, `Pending Approval`, `Rejected`) until orders are officially `Sent`.
- Built rich frontend interfaces:
  1. **PO Builder** (`POBuilder.jsx`): Interactive form with dynamic line item management, live subtotal & 18% GST calculation, shipping address inputs, and draft submission.
  2. **PO Status Badge** (`POStatusBadge.jsx`): Visual badge with 11 distinct color tokens and icons for all FSM states.
  3. **Visual Timeline Stepper** (`POTimelineStepper.jsx`): 8-step chronological milestone stepper and complete audit history feed.
  4. **PO Detail View** (`PODetailView.jsx`): Complete PO inspection sheet displaying line items, totals card, role-specific workflow action buttons, and stepper.
  5. **Buyer Workspace Integration** (`BuyerPage.jsx`): "My Purchase Orders" table with status filter, search, quick submit/send actions, and PO Builder modal.
  6. **Vendor Workspace Integration** (`VendorPage.jsx`): "Incoming POs" tab with direct Acknowledge, Decline, and Invoice action triggers.
  7. **Admin Governance Integration** (`AdminPage.jsx`): "PO Approvals" tab allowing administrators to review and approve/reject pending purchase orders.

---

## 2. Request → Response Data Flow for PO Lifecycle

```
[Buyer drafts PO in POBuilder.jsx]
(Line items: Qty * Price, 18% GST auto-computed)
                 │
                 │ 1. POST /api/purchase-orders
                 │    Headers: Authorization: Bearer <token>
                 ▼
[Express Server: authMiddleware + roleMiddleware('Buyer', 'Admin')]
                 │
                 ▼
[Controller: createPurchaseOrder]
  ├─► Generates unique poNumber: "PO-202610-ABCD12"
  ├─► Computes subtotal, taxAmount (18%), totalAmount
  ├─► Sets initial status: "Draft"
  ├─► Appends initial history entry: { toStatus: 'Draft', actorRole: 'Buyer', remarks: 'PO created' }
  └─► Saves to MongoDB -> HTTP 201 Created
                 │
                 ▼
[Buyer submits for approval]
                 │
                 │ 2. PATCH /api/purchase-orders/:id/status
                 │    Body: { status: "Pending Approval", remarks: "Budget review requested" }
                 ▼
[Controller: transitionPOStatus]
  ├─► Checks FSM Table: isValidPOTransition('Draft', 'Pending Approval') => TRUE
  ├─► Checks Role Permissions: canUserTransitionPO('Buyer', 'Draft', 'Pending Approval') => TRUE
  ├─► Appends history entry: { fromStatus: 'Draft', toStatus: 'Pending Approval', ... }
  ├─► Updates order.status = "Pending Approval"
  ├─► Logs system AuditLog
  └─► Saves -> HTTP 200 OK
                 │
                 ▼
[Admin Governance approves]
                 │
                 │ 3. PATCH /api/purchase-orders/:id/status
                 │    Body: { status: "Approved", remarks: "Capex budget cleared" }
                 ▼
[Controller validates FSM: 'Pending Approval' -> 'Approved' (Admin only) => TRUE]
  └─► order.status = "Approved"
                 │
                 ▼
[Buyer dispatches to supplier]
                 │
                 │ 4. PATCH /api/purchase-orders/:id/status
                 │    Body: { status: "Sent" }
                 ▼
[Controller validates FSM: 'Approved' -> 'Sent' (Buyer/Admin) => TRUE]
  └─► order.status = "Sent" -> Order now visible to Vendor in "Incoming POs"
                 │
                 ▼
[Vendor reviews & commits]
                 │
                 │ 5. PATCH /api/purchase-orders/:id/status
                 │    Body: { status: "Acknowledged", remarks: "Delivery confirmed by Oct 25" }
                 ▼
[Controller validates: Caller is owning Vendor entity & FSM allows 'Sent' -> 'Acknowledged' => TRUE]
  └─► order.status = "Acknowledged"
                 │
                 ▼
[Physical Delivery & Billing: Delivered -> Invoiced -> Closed]
  ├─► Buyer/Vendor/Admin triggers "Delivered"
  ├─► Vendor registers invoice -> "Invoiced"
  └─► Buyer/Admin clears payment and closes -> "Closed"
```

---

## 3. Key Files and Responsibilities

| File Path | Description |
|---|---|
| `server/src/utils/poStateMachine.js` | Pure FSM transition table (`PO_TRANSITION_MAP`), status definitions (`PO_STATUS`), role permissions (`PO_ROLE_TRANSITION_PERMISSIONS`), and validation functions (`isValidPOTransition`, `canUserTransitionPO`, `getAllowedTransitions`). |
| `server/src/models/PurchaseOrder.js` | Mongoose schema with line items schema, full status enum, auto-generated PO number, financial fields, pre-save total calculators, and append-only `history` subdocument array. |
| `server/src/controllers/purchaseOrderController.js` | Express controller handling PO creation, role-scoped queries, detail fetching, and role-gated state transitions with ownership verification. |
| `server/src/routes/purchaseOrderRoutes.js` | Express router exposing `/api/purchase-orders` endpoints protected by JWT authentication and RBAC middleware. |
| `client/src/store/slices/purchaseOrderSlice.js` | Redux Toolkit slice managing `fetchPurchaseOrders`, `fetchPODetails`, `createPO`, `updatePOStatus`, and optimistic UI reducer `setPOStatusOptimistic`. |
| `client/src/components/POStatusBadge.jsx` | Visual badge displaying distinct status colors (e.g., Draft=slate, Pending=amber, Approved=emerald, Sent=sky, Acknowledged=teal, Delivered=blue, Invoiced=purple, Closed=green, Rejected/Declined=rose). |
| `client/src/components/POTimelineStepper.jsx` | Visual 8-step lifecycle progress bar and chronological append-only audit feed. |
| `client/src/components/POBuilder.jsx` | Purchase Order creation modal with dynamic line items table, automatic subtotal and 18% GST calculation, and draft submission. |
| `client/src/components/PODetailView.jsx` | PO view displaying order metadata, financial totals, line items, visual timeline stepper, and role-specific action buttons. |
| `client/src/pages/BuyerPage.jsx` | Buyer workspace hosting "My Purchase Orders" directory, status filters, PO builder launcher, and PO detail view. |
| `client/src/pages/VendorPage.jsx` | Vendor workspace featuring "Incoming POs" tab with direct Acknowledge, Decline, and Invoice action triggers. |
| `client/src/pages/AdminPage.jsx` | Admin workspace with "PO Approvals" tab for reviewing and approving/rejecting purchase orders submitted by buyers. |

---

## 4. Internals & Architectural Decisions

### 1. Modeling the Finite State Machine as a Lookup Table vs Scattered if/else
- **The Anti-Pattern (Scattered if/else)**:
  In unstructured applications, status transitions are often handled with nested `if/else` checks scattered across controllers, services, and endpoints:
  ```js
  // Fragile, hard to test, prone to bypass bugs
  if (req.body.status === 'Approved') {
    if (order.status !== 'Pending Approval') throw Error();
    if (user.role !== 'Admin') throw Error();
  } else if (req.body.status === 'Sent') {
    if (order.status !== 'Approved') throw Error();
  }
  ```
  This approach breaks down quickly as the state machine grows: developers add bypass conditions in new routes, edge cases go untested, and visualizing valid paths requires scanning hundreds of lines of procedural code.

- **The Solution (Pure Transition Lookup Table)**:
  In VendorFlow, the state machine is formalized as a pure declarative dictionary (`PO_TRANSITION_MAP`) inside `server/src/utils/poStateMachine.js`:
  ```js
  const PO_TRANSITION_MAP = Object.freeze({
    [PO_STATUS.DRAFT]: [PO_STATUS.PENDING_APPROVAL, PO_STATUS.CANCELLED],
    [PO_STATUS.PENDING_APPROVAL]: [PO_STATUS.APPROVED, PO_STATUS.REJECTED, PO_STATUS.CANCELLED],
    [PO_STATUS.APPROVED]: [PO_STATUS.SENT, PO_STATUS.CANCELLED],
    [PO_STATUS.SENT]: [PO_STATUS.ACKNOWLEDGED, PO_STATUS.DECLINED, PO_STATUS.CANCELLED],
    [PO_STATUS.ACKNOWLEDGED]: [PO_STATUS.DELIVERED, PO_STATUS.CANCELLED],
    [PO_STATUS.DELIVERED]: [PO_STATUS.INVOICED],
    [PO_STATUS.INVOICED]: [PO_STATUS.CLOSED],
    [PO_STATUS.CLOSED]: [],
    [PO_STATUS.REJECTED]: [PO_STATUS.DRAFT],
    [PO_STATUS.DECLINED]: [PO_STATUS.DRAFT],
    [PO_STATUS.CANCELLED]: [],
  });
  ```
  **Benefits**:
  1. **Mathematical Guarantees**: Invalid state transitions (e.g., jumping from `Draft` straight to `Acknowledged` or `Closed`) are rejected in $O(1)$ constant time with an informative error message: `Illegal transition from "Draft" to "Closed"`.
  2. **100% Testable in Isolation**: The transition logic is a pure function that does not depend on database connections, HTTP requests, or framework mock objects.
  3. **Separation of Concerns**: State machine mechanics (what transitions are mathematically possible) are decoupled from role authorization (who has permission to perform the transition).

---

### 2. Why Status Changes are Recorded as an Append-Only History Subdocument Instead of Just Overwriting a String
In financial and procurement applications, simply updating `order.status = newStatus` destroys critical business and compliance data:
- **Audit Deficits**: If an order was rejected or declined, who rejected it? What was their stated reason? When did the transition take place?
- **Dispute Resolution**: If a vendor claims they never acknowledged an order, or a buyer claims delivery was late, an overwritten string provides zero forensic evidence.
- **Cycle-Time Analytics**: Procurement organizations need to analyze how long orders spend in `Pending Approval` before being approved, or how many days suppliers take between `Sent` and `Acknowledged`.

To solve this, VendorFlow implements an **append-only history subdocument array** embedded directly within the `PurchaseOrder` schema:
```js
history: [
  {
    fromStatus: { type: String, required: true },
    toStatus: { type: String, required: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    actorName: { type: String, required: true },
    actorRole: { type: String, required: true },
    remarks: { type: String, trim: true, default: '' },
    timestamp: { type: Date, default: Date.now },
  }
]
```
**Key Advantages**:
1. **Atomic Updates**: Because the `history` subdocument is embedded in the same document as `status`, MongoDB writes both in a single atomic operation, preventing race conditions or desynchronization between current state and audit log.
2. **Immutable Audit Trail**: Previous entries are never mutated or deleted. Each transition pushes a new record with the authenticated user's ID, display name, role, remarks, and exact server timestamp.
3. **Chronological UI Stepper**: The frontend (`POTimelineStepper.jsx`) reads this subdocument array directly to render the audit feed beneath the stepper.

---

### 3. Role-Based Conditional Rendering for Buyer vs Vendor Views of the Same Record
Both Buyer and Vendor view the exact same `PurchaseOrder` document, but their interfaces reflect fundamentally different responsibilities and authorization levels:

| Interface Element | Buyer Perspective | Vendor Perspective | Admin Perspective |
|---|---|---|---|
| **Draft Orders** | Full visibility. Buyer can edit items, delete lines, and click **Submit for Approval**. | Hidden. Vendors cannot view unapproved internal drafts. | Full visibility. |
| **Pending Approval** | Visible. Status badge shows `Pending Approval`. Awaits admin governance. | Hidden. Orders in approval queue are internal to the enterprise. | Actionable. Admin sees **Approve Purchase Order** and **Reject** buttons. |
| **Approved Orders** | Actionable. Buyer sees **Send Order to Vendor** button to dispatch contract. | Hidden until transmitted. | Visible. |
| **Sent Orders** | Awaiting supplier confirmation. Status badge shows `Sent`. | Actionable. Vendor sees prominent **Acknowledge Order** and **Decline Order** action buttons. | Visible. |
| **Acknowledged Orders** | Supplier accepted. Actionable: **Mark as Delivered** when physical delivery arrives. | Fulfilling order. Actionable: **Mark as Delivered** upon shipping goods. | Actionable. |
| **Delivered Orders** | Awaiting supplier billing. | Actionable. Vendor sees **Register Invoice** button to trigger accounts payable. | Actionable. |
| **Invoiced Orders** | Actionable. Buyer sees **Close Purchase Order** button to archive completed order. | View-only. Awaits final closure by enterprise procurement. | Actionable. Admin sees **Close Purchase Order** button. |

In `PODetailView.jsx`, this is enforced through clean role predicates:
```jsx
const isBuyerOrAdmin = user?.role === 'Buyer' || user?.role === 'Admin';
const isAdmin = user?.role === 'Admin';
const isVendor = user?.role === 'Vendor';

// Only Buyer/Admin can submit draft for approval
{po.status === 'Draft' && isBuyerOrAdmin && (
  <button onClick={() => handleTransition('Pending Approval')}>Submit for Approval</button>
)}

// Only Admin can approve or reject
{po.status === 'Pending Approval' && isAdmin && (
  <>
    <button onClick={() => handleTransition('Approved')}>Approve Purchase Order</button>
    <button onClick={() => handleTransition('Rejected')}>Reject</button>
  </>
)}

// Only owning Vendor can acknowledge or decline
{po.status === 'Sent' && isVendor && (
  <>
    <button onClick={() => handleTransition('Acknowledged')}>Acknowledge Order</button>
    <button onClick={() => handleTransition('Declined')}>Decline Order</button>
  </>
)}
```

---

## 5. How to Verify

### 1. Automated FSM Transition Tests
Run the standalone state machine unit verification script:
```powershell
node server/test_po_fsm.js
```
**Expected Output**:
- Valid transitions return `true`.
- Illegal transitions (e.g., `Draft -> Closed` or `Pending Approval -> Sent`) throw error with status `400` and message `Illegal transition from "X" to "Y"`.
- Role checks pass for authorized users and reject unauthorized roles.

### 2. End-to-End API Lifecycle Verification
Execute the automated end-to-end PowerShell script:
```powershell
powershell -ExecutionPolicy Bypass -File server/test_po_e2e.ps1
```
**Expected Output**:
```
PO Created: PO-202610-859424 | Status: Draft | Total: 167560 INR
Transitioned to: Pending Approval
Transitioned to: Approved
Transitioned to: Sent
Transitioned to: Acknowledged
Transitioned to: Delivered
Transitioned to: Invoiced
Transitioned to: Closed
PO Lifecycle Complete! Final Status: Closed | History entries: 8
```

### 3. Full UI Verification via Browser
1. **Login as Buyer** (`buyer@vendorflow.com` / `Buyer@123`):
   - Navigate to **Buyer Procurement & Lifecycle**.
   - Click **Draft New Purchase Order**, add line items (observe live subtotal and 18% GST calculation), and click **Create Purchase Order Draft**.
   - Click **Submit for Approval** on the newly created order.
2. **Login as Admin** (`admin@vendorflow.com` / `Admin@123`):
   - Navigate to **PO Approvals** tab.
   - Locate the order in `Pending Approval` state and click **Approve**.
3. **Login as Buyer**:
   - Locate the approved order and click **Send Order to Vendor**.
4. **Login as Vendor** (`vendor@vendorflow.com` / `Vendor@123`):
   - Navigate to **Incoming POs** tab.
   - Click **Acknowledge Order**.
   - Click **Details** to inspect the visual 8-step progress stepper and chronological audit feed.
   - Click **Mark as Delivered**, then click **Submit Invoice**.
5. **Login as Buyer or Admin**:
   - Open the order details and click **Close Purchase Order**. Status transitions to `Closed`.

---

## 6. Next-Phase Hooks (Phase 6: Notifications & Audit Logging)
Phase 6 connects event-driven notifications across the entire portal:
1. **Status Transition Notifications**: Wire up automated email and in-app alerts whenever a PO transitions state (e.g., alert Admin when PO is submitted for approval; alert Vendor when PO is sent; alert Buyer when Vendor acknowledges or delivers).
2. **Global Audit Trail Explorer**: Provide an Admin-facing unified audit explorer consuming the `AuditLog` collection populated by every PO transition.
3. **Nodemailer Transport Integration**: Dispatch HTML notification templates with PO summaries and action links directly to buyer and vendor inboxes.
