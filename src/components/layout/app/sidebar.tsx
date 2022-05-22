import styled from "styled-components";
import { ServerInfo } from "./sidebar/serverInfo";
import { Channels } from "./sidebar/channels";
import { UserInfo } from "./sidebar/userInfo";
import { PuzzlePiece, Bell, Database, Folder, HardDrives } from 'phosphor-react'


import HyunsImg from '../../../assets/hyuns.jpg'

const Divver = styled.div`
    width: 220px;
    min-width: 220px;
    height: 100%;
    background-color: var(--gray2);
    border-left: solid 1px var(--gray4);
    border-top-left-radius: 12px;
    border-right: solid 1px var(--gray4);
`

const Line = styled.div`
    border-bottom: solid 1px var(--gray4);
`

interface SidebarProps {
    
}

export function Sidebar(props: SidebarProps) {

    return (
        <Divver>
            <ServerInfo title="Hyuns Dashboard" subTitle='dashboard.hyuns.dev' />
            <Line />
            <Channels channels={[
                {
                    dashboard: {
                        name: '대시보드',
                        to: 'dashboard',
                        icon: <PuzzlePiece />
                    },
                    notice: {
                        name: '알림',
                        to: 'notice',
                        icon: <Bell />
                    },
                    var: {
                        name: '변수',
                        to: 'var',
                        icon: <Database />
                    },
                    file: {
                        name: '파일',
                        to: 'file',
                        icon: <Folder />
                    }
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
