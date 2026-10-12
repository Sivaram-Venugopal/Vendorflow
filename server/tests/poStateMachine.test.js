import {
  PO_STATUSES,
  PO_TRANSITION_MAP,
  PO_ROLE_TRANSITION_PERMISSIONS,
  validatePOTransition,
} from '../src/utils/poStateMachine.js';

describe('Purchase Order Finite State Machine (FSM) Validator (Unit Tests)', () => {
  describe('Constants and Graph Definition', () => {
    it('should define all statutory PO statuses', () => {
      expect(PO_STATUSES).toContain('Draft');
      expect(PO_STATUSES).toContain('Pending Approval');
      expect(PO_STATUSES).toContain('Approved');
      expect(PO_STATUSES).toContain('Sent');
      expect(PO_STATUSES).toContain('Acknowledged');
      expect(PO_STATUSES).toContain('Delivered');
      expect(PO_STATUSES).toContain('Invoiced');
      expect(PO_STATUSES).toContain('Closed');
      expect(PO_STATUSES).toContain('Rejected');
      expect(PO_STATUSES).toContain('Declined');
      expect(PO_STATUSES).toContain('Cancelled');
    });

    it('should have empty transition arrays for terminal states', () => {
      expect(PO_TRANSITION_MAP['Closed']).toEqual([]);
      expect(PO_TRANSITION_MAP['Cancelled']).toEqual([]);
    });
  });

  describe('Happy Path State Transitions', () => {
    it('allows Buyer or Admin to transition Draft -> Pending Approval', () => {
      const resBuyer = validatePOTransition('Draft', 'Pending Approval', 'Buyer');
      expect(resBuyer.isValid).toBe(true);

      const resAdmin = validatePOTransition('Draft', 'Pending Approval', 'Admin');
      expect(resAdmin.isValid).toBe(true);
    });

    it('allows Admin to transition Pending Approval -> Approved', () => {
      const res = validatePOTransition('Pending Approval', 'Approved', 'Admin');
      expect(res.isValid).toBe(true);
    });

    it('allows Buyer or Admin to transition Approved -> Sent', () => {
      const resBuyer = validatePOTransition('Approved', 'Sent', 'Buyer');
      expect(resBuyer.isValid).toBe(true);

      const resAdmin = validatePOTransition('Approved', 'Sent', 'Admin');
      expect(resAdmin.isValid).toBe(true);
    });

    it('allows Vendor to transition Sent -> Acknowledged', () => {
      const res = validatePOTransition('Sent', 'Acknowledged', 'Vendor');
      expect(res.isValid).toBe(true);
    });

    it('allows delivery transition Acknowledged -> Delivered', () => {
      const res = validatePOTransition('Acknowledged', 'Delivered', 'Buyer');
      expect(res.isValid).toBe(true);
    });

    it('allows invoice transition Delivered -> Invoiced', () => {
      const res = validatePOTransition('Delivered', 'Invoiced', 'Vendor');
      expect(res.isValid).toBe(true);
    });

    it('allows closing transition Invoiced -> Closed', () => {
      const res = validatePOTransition('Invoiced', 'Closed', 'Admin');
      expect(res.isValid).toBe(true);
    });
  });

  describe('Branching & Disposition State Transitions', () => {
    it('allows Admin to transition Pending Approval -> Rejected', () => {
      const res = validatePOTransition('Pending Approval', 'Rejected', 'Admin');
      expect(res.isValid).toBe(true);
    });

    it('allows Vendor to transition Sent -> Declined', () => {
      const res = validatePOTransition('Sent', 'Declined', 'Vendor');
      expect(res.isValid).toBe(true);
    });

    it('allows Buyer or Admin to cancel PO from Draft, Approved, or Sent', () => {
      expect(validatePOTransition('Draft', 'Cancelled', 'Buyer').isValid).toBe(true);
      expect(validatePOTransition('Approved', 'Cancelled', 'Admin').isValid).toBe(true);
      expect(validatePOTransition('Sent', 'Cancelled', 'Buyer').isValid).toBe(true);
    });

    it('allows Rejected PO to be revised back to Draft', () => {
      const res = validatePOTransition('Rejected', 'Draft', 'Buyer');
      expect(res.isValid).toBe(true);
    });
  });

  describe('Illegal State Machine Jumps (Must Be Rejected)', () => {
    it('rejects transitioning Draft directly to Acknowledged', () => {
      const res = validatePOTransition('Draft', 'Acknowledged', 'Vendor');
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/Illegal state transition/);
    });

    it('rejects transitioning Draft directly to Closed', () => {
      const res = validatePOTransition('Draft', 'Closed', 'Admin');
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/Illegal state transition/);
    });

    it('rejects transitioning Sent directly to Closed', () => {
      const res = validatePOTransition('Sent', 'Closed', 'Admin');
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/Illegal state transition/);
    });

    it('rejects any transition out of terminal state Closed', () => {
      const res = validatePOTransition('Closed', 'Draft', 'Admin');
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/Illegal state transition/);
    });

    it('rejects transitioning to current status (no-op)', () => {
      const res = validatePOTransition('Approved', 'Approved', 'Admin');
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/already in 'Approved' status/);
    });

    it('rejects unrecognized target status strings', () => {
      const res = validatePOTransition('Draft', 'UNKNOWN_STATUS', 'Admin');
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/Invalid target status/);
    });
  });

  describe('Role-Based Authorization Enforcement', () => {
    it('forbids Vendor from Approving a PO', () => {
      const res = validatePOTransition('Pending Approval', 'Approved', 'Vendor');
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/Role unauthorized/);
    });

    it('forbids Buyer from Acknowledging a PO (only owning Vendor can)', () => {
      const res = validatePOTransition('Sent', 'Acknowledged', 'Buyer');
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/Role unauthorized/);
    });

    it('forbids Vendor from Closing a PO (only Buyer or Admin can)', () => {
      const res = validatePOTransition('Invoiced', 'Closed', 'Vendor');
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/Role unauthorized/);
    });
  });
});
