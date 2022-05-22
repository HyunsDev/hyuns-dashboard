import { BrowserRouter, Routes, Route , useLocation, useNavigate} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useEffect } from "react";
import styled from "styled-components";

import './style/transition.css'

import { LoginScreen } from "./screen/login/login";
import { AppRouter } from "./screen/app/app";



const Divver = styled.div`
    min-width: 100vw;
    width: 100vw;
`

interface RouterProps {

}

const DefaultChannel = () => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/app/dashboard/dashboard')
    }, [navigate])

    return <></>
}

export function Router(props: RouterProps) {
    return (
        <Divver>
            <BrowserRouter>
                <Routes>
                    <Route path="/app/" element={<DefaultChannel />}/>
                    <Route path="/app/:serverId/*" element={<AppRouter />}/>
                    <Route path="/login" element={<LoginScreen />}/>
                </Routes>
            </BrowserRouter>
        </Divver>
    )
}