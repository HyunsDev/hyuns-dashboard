import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { HorizonLNB } from "../../../components/channel/horizonLNB";

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
        </Divver>
    )
}