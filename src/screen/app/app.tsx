
import styled from "styled-components"
import { ServerSidebar, Footer } from "../../components/layout/app"

const ContextLayout = styled.div`
    width: 100%;
    height: calc(100% - 22px);
`


export function AppScreen() {

    return (
        <>
            <ContextLayout>
                <ServerSidebar />
            </ContextLayout>
            <Footer />
        </>
    )
}