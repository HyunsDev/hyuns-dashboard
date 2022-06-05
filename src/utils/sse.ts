export async function fetchSSE(url: string, callback: (data: string) => void, option: RequestInit) {
    const response: any = await fetch(url, option);
    const reader = response.body.getReader()
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        callback(new TextDecoder().decode(value))
    }
}
