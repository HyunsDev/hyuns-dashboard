import styled from "styled-components"
import { Routes, Route, useNavigate } from "react-router-dom"
import { ServerSidebar, Footer, Sidebar } from "../../components/app"

import { ChannelRouter } from "./channel/channelRouter"
import { useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const Divver = styled.div`
    height: calc(100vh - 22px);
`

const ContextLayout = styled.div`
    height: calc(var(--vh) * 100 - 22px);
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
    const navigate = useNavigate()

    useEffect(() => {
        ;(async() => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/server`, {
                    headers: {
                        Authorization: localStorage.getItem('token') || ''
                    }
                })
                return res.data
            } catch (err:any) {
                console.log(err.response)
                if (err.response.status === 401) {
                    toast.warn('로그인을 진행해주세요!')
                    navigate('/login')
                }
            }
        })()
    }, [navigate])

    return (
        <Routes>
            <Route path="/*" element={<AppScreen />}/>
        </Routes>
    )
}