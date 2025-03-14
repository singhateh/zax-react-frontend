import React, { createContext, useState } from 'react';

// Create the context with default values
const stateContext = createContext({
    user: null,
    token: null,
    setUser: () => { },
    setToken: () => { },
});

export const ContextProvider = ({ children }) => {


    const [user, _setUser] = useState(() => {
        const storedUser = localStorage.getItem('USER');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setToken = (newToken) => {
        _setToken(newToken);
        const key = 'ACCESS_TOKEN';
        if (newToken) {
            localStorage.setItem(key, newToken);
        } else {
            localStorage.removeItem(key);
        }
    };

    const setUser = (newUser) => {
        _setUser(newUser);
        const key = 'USER';
        if (newUser) {
            localStorage.setItem(key, JSON.stringify(newUser));
        } else {
            localStorage.removeItem(key);
        }
    };

    return (
        <stateContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </stateContext.Provider>
    );
};

export const useStateContext = () => {
    return React.useContext(stateContext);
};
