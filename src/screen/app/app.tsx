
import styled from "styled-components"
import { ServerSidebar, Footer, Sidebar } from "../../components/layout/app"

const ContextLayout = styled.div`
    width: 100%;
    height: calc(100% - 22px);
    display: flex;
`


export function AppScreen() {

    return (
        <>
            <ContextLayout>
                <ServerSidebar />
                <Sidebar />
            </ContextLayout>
            <Footer />
        </>
    )
}