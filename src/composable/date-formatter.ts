export function formatter(date: String): String {
    const d = new Date(date);

    return `${d.getHours()}:${d.getMinutes()}`
}