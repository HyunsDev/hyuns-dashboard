import { useEffect, useState } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { HorizonLNB } from "../../../../components/LNB/horizonLNB";
import { IndexTab } from "./indexTab";


interface ChannelProps {

}

export function ToolsChannel(props: ChannelProps) {
    const location = useLocation()
    const [ tabId, setTapId ] = useState('index')

    useEffect(() => {
        setTapId(location.pathname.split('/')[4] || 'index')
    }, [location.pathname])    

    return (
        <>
            <HorizonLNB menu={{
                'index': {
                    text: '도구',
                    to: '/app/tools'
                },
            }}
            selected={tabId}
            />
            <Routes>
                <Route path="/" element={<IndexTab />} />
            </Routes>
        </>
    )
}