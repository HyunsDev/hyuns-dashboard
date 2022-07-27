import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import { ServerCalendar2notion } from "./calendar2notion"
import { ServerDash } from "./dash"
import { ServerNotFound } from "./notfound"

function Servers() {
    return (
        <Routes>
            <Route path="/dash/*" element={<ServerDash />} />
            <Route path="/calendar2notion/*" element={<ServerCalendar2notion />} />
            <Route path="/*" element={<ServerNotFound />} />
        </Routes>
    )
}

export { Servers }