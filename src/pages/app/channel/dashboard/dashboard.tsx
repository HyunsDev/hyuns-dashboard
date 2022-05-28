import { useEffect, useState } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { HorizonLNB } from "../../../../components/LNB/horizonLNB";
import { DashboardTab } from "./dashboardTab";

const Divver = styled.div`
    width: 100%;
`

interface DashboardChannelProps {

}

export function DashboardChannel(props: DashboardChannelProps) {
    const location = useLocation()
    const [ tabId, setTapId ] = useState('dashboard')

    useEffect(() => {
        setTapId(location.pathname.split('/')[4] || 'index')
    }, [location.pathname])    

    return (
        <Divver>
            <HorizonLNB menu={{
                'index': {
                    text: '대시보드',
                    to: '/app/dashboard/dashboard'
                },
                'widget': {
                    text: '위젯',
                    to: '/app/dashboard/dashboard/widget'
                },
            }}
            selected={tabId}
            />
            <Routes>
                <Route path="/" element={<DashboardTab />} />
                <Route path="/widget" element={<>아직 개발중입니다 :(</>} />
            </Routes>
        </Divver>
    )
}