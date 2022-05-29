import { Route, Routes } from 'react-router-dom'

import { DashboardChannel } from './dashboard/dashboard'
import { VarChannel } from './var/varChannel'
import { ResourceChannel } from './resource/resourceChannel'
import { LambdaChannel } from './lambda/lambdaChannel'

interface ChannelRouterProps {

}

export function ChannelRouter(props: ChannelRouterProps) {

    return (
        <Routes>
            <Route path='/dashboard/*' element={<DashboardChannel />} />
            <Route path='/var/*' element={<VarChannel />} />
            <Route path='/resource/*' element={<ResourceChannel />} />
            <Route path='/lambda/*' element={<LambdaChannel />} />
        </Routes>
    )
}