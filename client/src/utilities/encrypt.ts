export function encrypt(data: any): string {
    return btoa(encodeURIComponent(JSON.stringify(data)));
}

export function decrypt(data: string) {
    try {
        return JSON.parse(decodeURIComponent(atob(data)));
    } catch {
        return null;
    }
}


