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
    return (
        <Divver>
            <DashboardTab />
        </Divver>
    )
}