export function getLocalStorage<T>(key: string, defaultValue: T): T {
    if (typeof window !== 'undefined') {
        const stickyValue = window.localStorage.getItem(key);
        return stickyValue !== null && stickyValue !== 'undefined'
            ? JSON.parse(stickyValue)
            : defaultValue;
    }
    return defaultValue;
}

export function setLocalStorage<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
}
