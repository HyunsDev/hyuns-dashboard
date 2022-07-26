import { useContext } from "react"
import { ServerContext } from "../context/serverContext"

function useServer() {
    return useContext(ServerContext)
}

export { useServer }