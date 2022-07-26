import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import { ServerDash } from "./dash"
import { ServerNotFound } from "./notfound"

function Servers() {
    return (
        <Routes>
            <Route path="/dash/*" element={<ServerDash />} />
            <Route path="/*" element={<ServerNotFound />} />
        </Routes>
    )
}

export { Servers }