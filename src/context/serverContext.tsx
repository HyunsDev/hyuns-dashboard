import React, { createContext, useMemo, useState } from "react";

interface Channel {
    icon: React.ReactElement
    name: string,
    to: string
}

type Channels = {
    [key: string]: Channel
}[]

interface Server {
    name: string
    url: string
    id: string
    channels: Channels
}

type ContextProps = [Server, (server: Server) => void]

export const ServerContext = createContext<ContextProps>([
    {
        name: '',
        url: '',
        id: '',
        channels: []
    }, 
    (server: Server) => {}
])

const ServerContextProvider = ({children}: {children: React.ReactElement}) => {
    const [server, setServer] = useState<Server>({
        name: '',
        url: '',
        id: '',
        channels: []
    })

    const actions = useMemo(
        () => ({
            initServer(server: Server) {
                setServer(server)
            }
        }), []
    )

    const value = useMemo<ContextProps>(() => [server, actions.initServer], [server, actions])

    return (
        <ServerContext.Provider value={value} >
            {children}
        </ServerContext.Provider>
    )
}

export default ServerContextProvider;
