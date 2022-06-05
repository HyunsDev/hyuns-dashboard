import styled from "styled-components";
import { ServerInfo } from "./serverInfo";
import { Channels } from "./channels";
import { UserInfo } from "./userInfo";
import { PuzzlePiece, Bell, Database, Folder, HardDrives, PaperPlaneTilt  } from 'phosphor-react'


import HyunsImg from '../../../assets/hyuns.jpg'

const Divver = styled.div`
    width: 220px;
    min-width: 220px;
    height: 100%;
    background-color: var(--gray2);
    border-left: solid 1px var(--gray4);
    border-top-left-radius: 12px;
    border-right: solid 1px var(--gray4);
    border-top: 1px solid #E7E7E7;
`

const Line = styled.div`
    border-bottom: solid 1px var(--gray4);
`

interface SidebarProps {
    
}

export function Sidebar(props: SidebarProps) {

    return (
        <Divver>
            <ServerInfo title="Hyuns Dashboard" subTitle='dash.hyuns.dev' />
            <Line />
            <Channels channels={[
                {
                    dashboard: {
                        name: '대시보드',
                        to: 'dashboard',
                        icon: <PuzzlePiece />
                    },
                    message: {
                        name: '알림 & 메세지',
                        to: 'message',
                        icon: <Bell />
                    },
                    var: {
                        name: '변수',
                        to: 'var',
                        icon: <Database />
                    },
                    resource: {
                        name: '파일',
                        to: 'resource',
                        icon: <Folder />
                    },
                    lambda: {
                        name: 'Lambda',
                        to: 'lambda',
                        icon: <PaperPlaneTilt />
                    },
                },
                {
                    server: {
                        name: '서버',
                        to: 'server',
                        icon: <HardDrives />
                    },
                }
            ]}
                defaultChannel='dashboard'
            />
            <UserInfo title="혀느현스" subTitle="hyunsDev" img={HyunsImg} />

        </Divver>
    );
}
