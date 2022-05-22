import styled from "styled-components"
import { Routes, Route, useNavigate } from "react-router-dom"
import { ServerSidebar, Footer, Sidebar } from "../../components/layout/app"
import { useEffect, useState } from "react"

import { ChannelRouter } from "./channel/channelRouter"

const Divver = styled.div`
    height: calc(100vh - 22px);
`

const ContextLayout = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
`

function AppScreen() {
    return (
        <Divver>
            <ContextLayout>
                <ServerSidebar />
                <Sidebar />
                <ChannelRouter />
            </ContextLayout>
            <Footer />
        </Divver>
    )
}

export function AppRouter() {
    return (
        <Routes>
            <Route path="/*" element={<AppScreen />}/>
        </Routes>
    )
}