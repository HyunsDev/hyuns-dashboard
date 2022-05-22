import { Route, Routes } from 'react-router-dom'

import { DashboardChannel } from './dashboard'

interface ChannelRouterProps {

}

export function ChannelRouter(props: ChannelRouterProps) {

    return (
        <Routes>
            <Route path='/dashboard/*' element={<DashboardChannel />} />
        </Routes>
    )
}