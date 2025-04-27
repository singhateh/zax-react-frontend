export const createDebouncer = () => {
    let timeoutId;

    return (func, delay = 300) => {
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };
};