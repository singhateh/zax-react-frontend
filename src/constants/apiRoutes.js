export const ALERT_ROUTES = {
    BASE: '/doctor/alerts',
    CREATE: '/doctor/alerts/store',
    GET_ALL: '/doctor/alerts',
    GET_BY_ID: (id) => `/doctor/alerts/${id}`,
    UPDATE: (id) => `/doctor/alerts/update/${id}`,
    DELETE: (id) => `/doctor/alerts/delete/${id}`,
    SEARCH_CLAIMANTS: '/doctor/alerts/search-users',
};

export const BILLING_ROUTES = {
    BASE: '/doctor/alerts',
    CREATE: '/doctor/alerts/store',
    GET_ALL: '/doctor/alerts',
    GET_BY_ID: (id) => `/doctor/alerts/${id}`,
    UPDATE: (id) => `/doctor/alerts/update/${id}`,
    DELETE: (id) => `/doctor/alerts/delete/${id}`,
    SEARCH_CLAIMANTS: '/doctor/alerts/search-users',
};


export const CLAIMANT_ROUTES = {
    GET_ALL: '/claimants',
};

export const DROPDOWN_OPTIONS = {
    TABS: '/dropdowns/tabs',
    PRIORITIES: '/dropdowns/priorities',
    COLORS: '/dropdowns/colors',
};
