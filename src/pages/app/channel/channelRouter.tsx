import { Route, Routes } from 'react-router-dom'

import { DashboardChannel } from './dashboard/dashboard'
import { VarChannel } from './var/varChannel'

interface ChannelRouterProps {

}

export function ChannelRouter(props: ChannelRouterProps) {

    return (
        <Routes>
            <Route path='/dashboard/*' element={<DashboardChannel />} />
            <Route path='/var/*' element={<VarChannel />} />
        </Routes>
    )
}