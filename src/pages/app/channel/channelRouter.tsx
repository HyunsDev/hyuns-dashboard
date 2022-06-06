import { Route, Routes } from 'react-router-dom'

import { DashboardChannel } from './dashboard/dashboard'
import { VarChannel } from './var/varChannel'
import { ResourceChannel } from './resource/resourceChannel'
import { LambdaChannel } from './lambda/lambdaChannel'
import { ServerChannel } from './server/serverChannel'
import { MessageChannel } from './message/message'

import styled from 'styled-components'

interface ChannelRouterProps {

}

const Divver = styled.div`
    border-top: 1px solid #E7E7E7;
    box-sizing: border-box;
    width: 100%;
    @media ( max-width: 767px ) {
        min-width: 100vw;
        max-width: 100vw;
    }
`

export function ChannelRouter(props: ChannelRouterProps) {

    return (
        <Divver>
            <Routes>
                <Route path='/dashboard/*' element={<DashboardChannel />} />
                <Route path='/var/*' element={<VarChannel />} />
                <Route path='/resource/*' element={<ResourceChannel />} />
                <Route path='/lambda/*' element={<LambdaChannel />} />
                <Route path='/server/*' element={<ServerChannel />} />
                <Route path='/message/*' element={<MessageChannel />} />
            </Routes>
        </Divver>
    )
}