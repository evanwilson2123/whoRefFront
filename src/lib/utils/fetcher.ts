

export async function fetcher<T>(url: string): Promise<T | Error> {
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}${url}`);
        if (!response.ok) {
            console.error("Failed to fetch");
            return new Error(`Failed to fetch: ${url}`);
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error(error);
        return new Error(`Failed to fetch: ${url}`);
    }
}
