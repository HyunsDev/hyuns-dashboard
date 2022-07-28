
export function useTitle() {
    return (title?: string) => {
        document.title = title ? `${title} | Hyuns Dash` : 'Hyuns Dash'
    }
}