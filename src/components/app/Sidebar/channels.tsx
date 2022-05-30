import { Channel } from './channel'
import { IconContext, Horse, Heart, Cube } from "phosphor-react";
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Divver = styled.div`
    height: calc(100% - 60px - 50px);
`

const InnerDivver = styled.div`
    position: relative;
`

interface ChannelsProps {
    channels: { [key: string]: {
        name: string;
        to: string;
        icon: string | React.ReactElement;
    }}[],
    defaultChannel: string
}

const ChannelsDivver = styled.div`
    border-bottom: solid 1px var(--gray4);
    padding-bottom: 8px;
    padding-top: 8px;
`

const SelectedChannelBackground = styled.div<{top: number}>`
    position: absolute;
    left: 0;
    top: ${props => props.top}px;
    width: 208px;
    height: 32px;
    background-color: var(--gray3); 
    border-top-right-radius: 14px;
    border-bottom-right-radius: 14px;
    margin-top: 2px;
    transition: 180ms;
`

const SelectedChannelHoverBackground = styled.div<{top: number, isShow: boolean}>`
    opacity: ${props => props.isShow ? 0.5 : 0};
    position: absolute;
    left: 0;
    top: ${props => props.top}px;
    width: 208px;
    height: 32px;
    background-color: var(--gray3); 
    border-top-right-radius: 14px;
    border-bottom-right-radius: 14px;
    margin-top: 2px;
    transition: 70ms;
`


export function Channels(props: ChannelsProps) {
    const location = useLocation()

    const DivRef = useRef<any>(null)
    const targets = useRef<any>({})
    const timer = useRef<any>(0)

    const [ selectedChannelId, setSelectedChannelId ] = useState(props.defaultChannel)
    const [ selectedChannelBackgroundTop, setSelectedChannelBackgroundTop ] = useState(0)
    const [ selectedChannelBackgroundHoverTop, setSelectedChannelBackgroundHoverTop ] = useState(0)
    const [ isShowSelectedChannelBackgroundHoverTop, setShowSelectedChannelBackgroundHoverTop ] = useState(false)

    useEffect(() => {
        setSelectedChannelBackgroundTop(targets.current[selectedChannelId]?.getBoundingClientRect().top - DivRef.current?.getBoundingClientRect().top)
    }, [selectedChannelId])

    useEffect(() => {
        setSelectedChannelId(location.pathname.split("/")[3])
    }, [location])

    const mouseOver = () => {
        clearTimeout(timer.current)
        setShowSelectedChannelBackgroundHoverTop(true)
    }

    const mouseOut = () => {
        timer.current = setTimeout(() => {
            setShowSelectedChannelBackgroundHoverTop(false);
            setSelectedChannelBackgroundHoverTop(targets.current[selectedChannelId].getBoundingClientRect().top - DivRef.current.getBoundingClientRect().top)
        }, 100)
    }

    return (
        <Divver>
            <InnerDivver 
                ref={DivRef} 
                onMouseOver={() => mouseOver()} 
                onMouseOut={() => mouseOut()}>
                <IconContext.Provider
                    value={{
                        color: "var(--gray5)",
                        size: 16,
                        weight: "fill",
                        mirrored: false,
                    }}
                    >
                    {
                        props.channels.map((e,i) => {
                            return <ChannelsDivver key={i}>
                                {
                                    Object.entries(e).map((channel) => {
                                        return <Channel
                                            key={channel[0]}
                                            {...channel[1]}
                                            isSelected={false}
                                            ref={(el:any) => targets.current[channel[0]] = el}
                                            onMouseOver={() => setSelectedChannelBackgroundHoverTop(targets.current[channel[0]].getBoundingClientRect().top - DivRef.current.getBoundingClientRect().top)}
                                            to={channel[1].to}
                                        />
                                    })
                                }
                            </ChannelsDivver>
                        })
                    }
                </IconContext.Provider>

                <SelectedChannelBackground top={selectedChannelBackgroundTop} />
                <SelectedChannelHoverBackground top={selectedChannelBackgroundHoverTop} isShow={isShowSelectedChannelBackgroundHoverTop} />
            </InnerDivver>
            


            
            
        </Divver>
    )
}