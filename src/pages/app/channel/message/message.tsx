import { useEffect, useState } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { HorizonLNB } from "../../../../components/LNB/horizonLNB";
import { MessageTab } from "./messageTab";

const Divver = styled.div`
    width: 100%;
`

interface ChannelProps {

}

export function MessageChannel(props: ChannelProps) {
    const location = useLocation()
    const [ tabId, setTapId ] = useState('message')

    useEffect(() => {
        setTapId(location.pathname.split('/')[4] || 'index')
    }, [location.pathname])    

    useEffect(() => {
        const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/message/sse`);
        eventSource.onmessage = (e) => {
            console.log(e.data)
        }

        return () => {
            eventSource.close()
        }
    }, [])

    return (
        <Divver>
            <HorizonLNB menu={{
                'index': {
                    text: '메세지',
                    to: '/app/dashboard/message'
                },
                'all': {
                    text: '전체',
                    to: '/app/dashboard/message/all'
                },
            }}
            selected={tabId}
            />
            <Routes>
                <Route path="/" element={<MessageTab />} />
                <Route path="/all" element={<>아직 개발중입니다 :(</>} />
            </Routes>
        </Divver>
    )
}