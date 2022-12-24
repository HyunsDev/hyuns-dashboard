import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
    PuzzlePiece,
    Bell,
    Database,
    Folder,
    HardDrives,
    PaperPlaneTilt,
    Nut,
    Bookmark,
    GoogleChromeLogo,
    Image,
} from "phosphor-react";

import { DashboardChannel } from "./dashboard/dashboard";
import { VarChannel } from "./var/varChannel";
import { ResourceChannel } from "./resource/resourceChannel";
import { LambdaChannel } from "./lambda/lambdaChannel";
import { ServerChannel } from "./server/serverChannel";
import { MessageChannel } from "./message/message";

import styled from "styled-components";
import { useServer } from "../../../hooks/useServer";
import { useEffect } from "react";
import { ToolsChannel } from "./tools";
import { useTitle } from "../../../hooks/modal/useTitle";
import { BookmarkChannel } from "./bookmark/bookmark";
import { RequestChannel } from "./request/requestChannel";
import { ImageChannel } from "./image/imageChannel";

interface ChannelRouterProps {}

const Divver = styled.div`
    border-top: 1px solid #e7e7e7;
    box-sizing: border-box;
    width: 100%;
    @media (max-width: 767px) {
        min-width: 100vw;
        max-width: 100vw;
    }
`;

export function ServerDash(props: ChannelRouterProps) {
    const editTitle = useTitle();
    const [server, initServer] = useServer();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        editTitle();
    }, [editTitle]);

    useEffect(() => {
        initServer({
            name: "Hyuns Dash",
            url: "https://dash.hyuns.dev/app/dash",
            id: "dash",
            channels: [
                {
                    index: {
                        name: "대시보드",
                        to: "",
                        icon: <PuzzlePiece />,
                    },
                    message: {
                        name: "알림 & 메세지",
                        to: "message",
                        icon: <Bell />,
                    },
                    var: {
                        name: "변수",
                        to: "var",
                        icon: <Database />,
                    },
                    resource: {
                        name: "리소스",
                        to: "resource",
                        icon: <Folder />,
                    },
                    image: {
                        name: "이미지",
                        to: "image",
                        icon: <Image />,
                    },
                    tools: {
                        name: "도구",
                        to: "tools",
                        icon: <Nut />,
                    },
                    bookmark: {
                        name: "북마크",
                        to: "bookmark",
                        icon: <Bookmark />,
                    },
                    request: {
                        name: "리퀘스트",
                        to: "request",
                        icon: <GoogleChromeLogo />,
                    },
                    lambda: {
                        name: "Lambda",
                        to: "lambda",
                        icon: <PaperPlaneTilt />,
                    },
                },
                {
                    server: {
                        name: "서버",
                        to: "server",
                        icon: <HardDrives />,
                    },
                },
            ],
        });
    }, [initServer]);

    return (
        <Divver>
            <Routes>
                <Route path="/var/*" element={<VarChannel />} />
                <Route path="/resource/*" element={<ResourceChannel />} />
                <Route path="/image/*" element={<ImageChannel />} />
                <Route path="/lambda/*" element={<LambdaChannel />} />
                <Route path="/server/*" element={<ServerChannel />} />
                <Route path="/message/*" element={<MessageChannel />} />
                <Route path="/bookmark/*" element={<BookmarkChannel />} />
                <Route path="/request/*" element={<RequestChannel />} />
                <Route path="/tools/*" element={<ToolsChannel />} />
                <Route path="/*" element={<DashboardChannel />} />
            </Routes>
        </Divver>
    );
}
