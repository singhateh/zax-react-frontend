export const ZAXACCESSTOKEN = "access";
export const REFRESH_TOKEN = "refresh";



export const CASE_TYPE = {
    MEDICOLEGAL: 'medico_legal',
    PRIVATE: 'private',
    COSMETICS: 'cosmetics',
    ALL: 'all',
};

export const PAYPAL_STATUS = {
    PENDING: 0,
    IN_PROCESS: 1,
    SUCCESS: 2,
    CANCEL: 3,
    ERROR: 4,
};

export const APPOINTMENT_SLOT_STATUS = {
    AVAILABLE: 'Available',
    BOOKED: 'Booked',
    REBOOKED: 'ReBooked',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    BLOCKED: 'Blocked',
    UNBLOCKED: 'UnBlocked',
    RESERVED: 'Reserved',
    DNA: 'DNA',
    RESCHEDULED: 'Rescheduled',
    CONFIRMED: 'Confirmed',
};

export const CONTRACT_STATUS = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    REACCEPTED: 'ReAccepted',
    HOLD: 'Hold',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Expired',
    TERMINATED: 'Terminated',
};

export const STATUS_LETTER = {
    INACTIVE: 'InActive',
    ACTIVE: 'Active',
    BANNED: 'Banned',
    ARCHIVE: 'Archive',
};

export const STATUS_REPORT = {
    PENDING: 'Pending',
    DID_NOT_ATTEND: 'DidNotAttend',
    INCOMPLETE: 'Incomplete',
    PUBLISHED: 'Published',
    COMPLETED: 'Completed',
    AMENDED: 'Amended',
};

export const CASE_STATUS = {
    UNAPPOINTED: 'Un-Appointed',
    APPOINTED: 'Appointed',
    INCOMPLETE: 'Incomplete',
    REPORT_TO_BUILD: 'Report-to-build',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    HOLD: 'Hold',
    RELEASED: 'Released',
    DELETED: 'Deleted',
    CASE: 'Case',
    DNA: 'DNA',
    RESCHEDULED: 'Rescheduled',
    CONFIRMED: 'Confirmed',
    REINSTRUCTED: 'ReInstructed',
};

export const DOCTOR_STATUS = {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
    HOLD: 'Hold',
    REQUESTED: 'Requested',
    CANCELLED: 'Cancelled',
    EXPIRED: 'Expired',
    TERMINATED: 'Terminated',
};

export const STATUS = {
    INACTIVE: 0,
    ACTIVE: 1,
    PENDING: 2,
    BANNED: 3,
    ARCHIVE: 4,
};

export const CASE_STATE = {
    PENDING: 'Pending',
    ATTENDED: 'Attended',
    NOT_ATTENDED: 'DNA',
    OVERDUE: 'OverDue',
    DONE: 'Done',
    CANCELLED: 'Cancelled',
};

export const COMPLAINT_STATUS = {
    PENDING: 'Pending',
    RECEIVED: 'Received',
    ACKNOWLEDGED: 'Acknowledged',
    UNDER_INVESTIGATION: 'Under Investigation',
    CLOSED: 'Closed',
    SETTLED: 'Settled',
};


export const INVOICE_STATUS = {
    UNPAID: 'UnPaid',
    OVERDUE: 'OverDue',
    PAID: 'Paid',
    PART_PAID: 'PartPaid',
    CANCELLED: 'Cancelled',
    PREVIEW: 'Preview',
};

export const TITLE = {
    MR: 0,
    DR: 1,
    MRS: 2,
    MISS: 3,
    SIR: 4,
    PROF: 5,
    NURSE: 6,
    MADAM: 7,
};

export const GENDER = {
    MALE: 0,
    FEMALE: 1,
};

export const CURRENT_SESSION = {
    YES: 1,
    NO: 0,
};
