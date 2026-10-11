/**
 * Finite State Machine (FSM) Transition Engine for Purchase Orders
 *
 * Allowed Lifecycle:
 * Draft -> Pending Approval -> Approved -> Sent -> Acknowledged -> Delivered -> Invoiced -> Closed
 *
 * Branching Dispositions:
 * - Pending Approval -> Rejected (Admin/Procurement can reject)
 * - Approved -> Cancelled (Buyer can cancel)
 * - Sent -> Declined (Vendor declines) or Cancelled
 * - Acknowledged -> Cancelled
 * - Draft -> Cancelled
 */

export const PO_STATUSES = [
  'Draft',
  'Pending Approval',
  'Approved',
  'Rejected',
  'Sent',
  'Acknowledged',
  'Declined',
  'Delivered',
  'Invoiced',
  'Closed',
  'Cancelled',
];

/**
 * State Transition Lookup Table
 * Defines valid target states from any given origin state.
 */
export const PO_TRANSITION_MAP = {
  Draft: ['Pending Approval', 'Cancelled'],
  'Pending Approval': ['Approved', 'Rejected', 'Cancelled'],
  Approved: ['Sent', 'Cancelled'],
  Rejected: ['Draft'], // Can be revised back to draft
  Sent: ['Acknowledged', 'Declined', 'Cancelled'],
  Acknowledged: ['Delivered', 'Cancelled'],
  Declined: ['Draft', 'Cancelled'],
  Delivered: ['Invoiced'],
  Invoiced: ['Closed'],
  Closed: [], // Terminal State
  Cancelled: [], // Terminal State
};

/**
 * Role-Based Transition Permissions
 * Specifies which user roles are authorized to perform each target transition.
 */
export const PO_ROLE_TRANSITION_PERMISSIONS = {
  'Pending Approval': ['Buyer', 'Admin'], // Buyer submits draft for approval
  Approved: ['Admin'], // Admin approves PO
  Rejected: ['Admin'], // Admin rejects PO
  Sent: ['Buyer', 'Admin'], // Buyer or Admin transmits PO to vendor
  Acknowledged: ['Vendor'], // Only Vendor can acknowledge
  Declined: ['Vendor'], // Only Vendor can decline
  Delivered: ['Buyer', 'Admin', 'Vendor'], // Delivery confirmed
  Invoiced: ['Vendor', 'Buyer', 'Admin'], // Invoice registered
  Closed: ['Admin', 'Buyer'], // Buyer/Admin completes lifecycle
  Draft: ['Buyer', 'Admin'], // Revert/revise
  Cancelled: ['Buyer', 'Admin'], // Cancellation
};

/**
 * Validates whether a state transition from `currentStatus` to `newStatus` is legal
 * and authorized for `userRole`.
 *
 * @param {String} currentStatus - Current PO status
 * @param {String} newStatus - Target status
 * @param {String} userRole - User's role ('Admin', 'Buyer', 'Vendor')
 * @returns {Object} { isValid: boolean, error?: string }
 */
export const validatePOTransition = (currentStatus, newStatus, userRole) => {
  if (!PO_STATUSES.includes(newStatus)) {
    return {
      isValid: false,
      error: `Invalid target status '${newStatus}'. Permitted statuses: ${PO_STATUSES.join(', ')}`,
    };
  }

  if (currentStatus === newStatus) {
    return {
      isValid: false,
      error: `Purchase order is already in '${currentStatus}' status`,
    };
  }

  const allowedNextStates = PO_TRANSITION_MAP[currentStatus] || [];
  if (!allowedNextStates.includes(newStatus)) {
    return {
      isValid: false,
      error: `Illegal state transition: Cannot move Purchase Order from '${currentStatus}' directly to '${newStatus}'. Allowed transitions: [${allowedNextStates.join(', ') || 'None (Terminal state)'}]`,
    };
  }

  // Verify Role Permission for this transition
  const permittedRoles = PO_ROLE_TRANSITION_PERMISSIONS[newStatus] || [];
  if (permittedRoles.length > 0 && !permittedRoles.includes(userRole)) {
    return {
      isValid: false,
      error: `Role unauthorized: Users with role '${userRole}' are not authorized to transition PO to '${newStatus}'. Required role(s): [${permittedRoles.join(', ')}]`,
    };
  }

  return { isValid: true };
};

export default {
  PO_STATUSES,
  PO_TRANSITION_MAP,
  PO_ROLE_TRANSITION_PERMISSIONS,
  validatePOTransition,
};
