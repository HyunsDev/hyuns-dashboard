import { BrowserRouter, Routes, Route , useLocation, useNavigate} from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useEffect } from "react";
import styled from "styled-components";

import './style/transition.css'

import { LoginScreen } from "./pages/login/login";
import { AppRouter } from "./pages/app/app";
import axios from "axios";
import { toast } from "react-toastify";
import { instance } from "./utils/axios";



const Divver = styled.div`
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
    useEffect(() => {
        instance.interceptors.response.use(() => {}, err => {
            console.error(err.response)
            toast.error(`요청에 오류가 발생했어요. ${err.response.status}`)
        })
    }, [])

    return (
        <Divver>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<DefaultChannel />}/>
                    <Route path="/app/" element={<DefaultChannel />}/>
                    <Route path="/app/:serverId/*" element={<AppRouter />}/>
                    <Route path="/login" element={<LoginScreen />}/>
                </Routes>
            </BrowserRouter>
        </Divver>
    )
}