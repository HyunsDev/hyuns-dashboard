import { BrowserRouter, Routes, Route , useLocation} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useEffect } from "react";
import styled from "styled-components";

import './style/transition.css'

import { LoginScreen } from "./screen/login/login";
import { AppScreen } from "./screen/app/app";



const Divver = styled.div`
    min-height: 100vh;
    min-width: 100vw;
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
`

interface RouterProps {

}

export function Router(props: RouterProps) {
    return (
        <Divver>
            <BrowserRouter>
                <Routes>
                    <Route path="/app" element={<AppScreen />}/>
                    <Route path="/login" element={<LoginScreen />}/>
                </Routes>
            </BrowserRouter>
        </Divver>
    )
}