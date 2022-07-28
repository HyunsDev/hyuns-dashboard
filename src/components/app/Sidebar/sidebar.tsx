import styled from "styled-components";
import { ServerInfo } from "./serverInfo";
import { Channels } from "./channels";
import { UserInfo } from "./userInfo";
import { PuzzlePiece, Bell, Database, Folder, HardDrives, PaperPlaneTilt  } from 'phosphor-react'


import HyunsImg from '../../../assets/hyuns.jpg'
import { useServer } from "../../../hooks/useServer";
import { useEffect } from "react";

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
    close: Function
}

export function Sidebar(props: SidebarProps) {
    const [ server ] = useServer()

    return (
        <Divver>
            <ServerInfo title={server.name} subTitle='dash.hyuns.dev' />
            <Line />
            <Channels close={props.close} channels={server.channels} />
            <UserInfo title="혀느현스" subTitle="hyunsDev" img={HyunsImg} />
        </Divver>
    );
}
