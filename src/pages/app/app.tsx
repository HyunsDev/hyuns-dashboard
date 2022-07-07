import styled from "styled-components"
import { Routes, Route, useNavigate } from "react-router-dom"
import { ServerSidebar, Footer, Sidebar } from "../../components/app"

import { ChannelRouter } from "./channel/channelRouter"
import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useSwipeable } from "react-swipeable"

const Divver = styled.div`
    width: 100%;
    @media ( max-width: 767px ) {
        max-width: fit-content;
        width: fit-content;
        overflow-x: hidden;
    }

    max-height: 100%;
    min-height: calc(var(--vh) * 100);
    height: calc(var(--vh) * 100);
`

const ContextLayout = styled.div`
    height: calc(100% - 22px);
    width: 100%;
    @media ( max-width: 767px ) {
        width: fit-content;
    }
    display: flex;
`

const SidebarsDiv = styled.div<{isPc: boolean, isOpen: boolean}>`
    display: flex;
    height: 100%;
    @media ( max-width: 767px ) {
        width: fit-content;
    }
    
    ${ props => !props.isPc && `
        position: fixed;
        height: calc(var(--vh) * 100 - 22px);
        top: 0;
        left: -278px;
        transition: 200ms;
    ` }

    ${ props => !props.isPc && props.isOpen && `
        left: 0px;
    ` }
`

const ChannelsDiv = styled.div<{isPc: boolean, isOpen: boolean}>`
    width: 100%;
    ${ props => !props.isPc && `
        position: fixed;
        height: calc(var(--vh) * 100 - 22px);
        top: 0;
        left: 0px;
        transition: 200ms;
    ` }

    ${ props => !props.isPc && props.isOpen && `
        left: 278px;
    ` }
`

function AppScreen() {
    const [ isPc, setIsPc ] = useState(window.innerWidth >= 768);
    const [ isOpen, setIsOpen ] = useState(false);
    const swipeHandler = useSwipeable({
        onSwipedLeft: () => setIsOpen(false),
        onSwipedRight: () => setIsOpen(true),
        touchEventOptions: {
            passive: false
        }
    })

    const updatePc = useCallback(() => {
        setIsPc(window.innerWidth >= 768)
    }, [])

    useEffect(() => {
        window.addEventListener("resize", updatePc);
        return () => window.removeEventListener("resize", updatePc);
      }, [updatePc]);

    return (
        <Divver {...swipeHandler}>
            <ContextLayout>
                <SidebarsDiv isPc={isPc} isOpen={isOpen}>
                    <ServerSidebar />
                    <Sidebar />
                </SidebarsDiv>
                <ChannelsDiv isPc={isPc} isOpen={isOpen}>
                    <ChannelRouter />
                </ChannelsDiv>
            </ContextLayout>
            <Footer />
        </Divver>
    )
}

// 앱 라우터
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