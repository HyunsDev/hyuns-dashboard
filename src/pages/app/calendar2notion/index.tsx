import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { PuzzlePiece, Bell, Database, Folder, HardDrives, PaperPlaneTilt, Nut  } from 'phosphor-react'

import { DashboardChannel } from './dashboard'

import styled from 'styled-components'
import { useServer } from '../../../hooks/useServer'
import { useEffect } from 'react'
import { useTitle } from '../../../hooks/modal/useTitle'
import { ToolsChannel } from './tools'

interface ChannelRouterProps {

}

const Divver = styled.div`
    border-top: 1px solid #E7E7E7;
    box-sizing: border-box;
    width: 100%;
    @media ( max-width: 767px ) {
        min-width: 100vw;
        max-width: 100vw;
    }
`

export function ServerCalendar2notion(props: ChannelRouterProps) {
    const [server, initServer] = useServer()
    const editTitle = useTitle()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        editTitle('Calendar2notion')
    }, [editTitle])

    useEffect(() => {
        initServer({
            name: 'Calendar2notion',
            url: 'https://dash.hyuns.dev/app/calendar2notion',
            id: 'c2n',
            channels: [
                {
                    index: {
                        name: '대시보드',
                        to: '',
                        icon: <PuzzlePiece />
                    }, 
                    tools: {
                        name: '도구',
                        to: 'tools',
                        icon: <Nut />
                    }
                }
            ]
        })
    }, [initServer])

    return (
        <Divver>
            <Routes>
                <Route path='/tools/*' element={<ToolsChannel />} />
                <Route path='/*' element={<DashboardChannel />} />
            </Routes>
        </Divver>
    )
}