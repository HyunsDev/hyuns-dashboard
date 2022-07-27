import { Bug } from "phosphor-react"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { useServer } from "../../../hooks/useServer"

const Divver = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
`

function ServerNotFound() {
    const [server, initServer] = useServer()

    useEffect(() => {
        initServer({
            url: 'dash.hyuns.dev',
            name: 'Void Server',
            id: 'notFound',
            channels: []
        })
    }, [initServer])

    return (
        <Divver>
            <Bug size={52} color="#595959" weight="light" />
            <div>존재하지 않는 서버에요... (404)</div>
            <Link to='/'>돌아가기</Link>
        </Divver>
    )
}

export {
    ServerNotFound
}