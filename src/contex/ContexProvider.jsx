import React, { createContext, useState } from 'react';

// Create the context with default values
const stateContext = createContext({
    doctors: [],
    selectedDoctor: null,
    user: null,
    token: null,
    setSelectedDoctor: () => { },
    setUser: () => { },
    setToken: () => { },
    setDoctors: () => [],
});

export const ContextProvider = ({ children }) => {

    // State hooks for user, token, selectedDoctor, and doctors
    const [selectedDoctor, _setSelectedDoctor] = useState(() => {
        const storedDoctor = localStorage.getItem('ZAXDOCTOR');
        return storedDoctor ? JSON.parse(storedDoctor) : null;
    });

    const [doctors, _setDoctors] = useState(() => {
        const storedAllDoctors = localStorage.getItem('ALLZAXDOCTORS');
        return storedAllDoctors ? JSON.parse(storedAllDoctors) : [];
    });

    const [user, _setUser] = useState(() => {
        const storedUser = localStorage.getItem('ZAXUSER');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, _setToken] = useState(localStorage.getItem('ZAXACCESSTOKEN'));

    // Function to set token and store in localStorage
    const setToken = (newToken) => {
        _setToken(newToken);
        const key = 'ZAXACCESSTOKEN';
        if (newToken) {
            localStorage.setItem(key, newToken);
        } else {
            localStorage.removeItem(key);
        }
    };

    // Function to set user and store in localStorage
    const setUser = (newUser) => {
        _setUser(newUser);
        const key = 'ZAXUSER';
        if (newUser) {
            localStorage.setItem(key, JSON.stringify(newUser));
        } else {
            localStorage.removeItem(key);
        }
    };

    // Function to set selected doctor and store in localStorage
    const setSelectedDoctor = (newDoctor) => {
        const Doctorkey = 'ZAXDOCTOR';

        _setSelectedDoctor((prevDoctor) => {
            const finalDoctor = typeof newDoctor === 'function' ? newDoctor(prevDoctor) : newDoctor;

            if (finalDoctor) {
                localStorage.setItem(Doctorkey, JSON.stringify(finalDoctor));
            } else {
                localStorage.removeItem(Doctorkey);
            }

            return finalDoctor;
        });
    };

    // Function to set doctors and store in localStorage
    const setDoctors = (allDoctors) => {
        _setDoctors(allDoctors);
        const key = 'ALLZAXDOCTORS';
        if (allDoctors) {
            localStorage.setItem(key, JSON.stringify(allDoctors));
        } else {
            localStorage.removeItem(key);
        }
    };

    return (
        <stateContext.Provider value={{
            user,
            setUser,
            token,
            setToken,
            selectedDoctor,
            setSelectedDoctor,
            doctors,
            setDoctors
        }}>
            {children}
        </stateContext.Provider>
    );
};

export const useStateContext = () => {
    return React.useContext(stateContext);
};
