import { forwardRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components"


const Divver = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 6px 12px;
    gap: 8px;
    cursor: pointer;
    user-select: none;
    z-index: 1;
    position: relative;
    font-size: 14px;
    text-decoration: none;
    color: #000000;
`

interface ChannelProps {
    name: string;
    icon: string | React.ReactElement;
    isSelected: boolean;
    onMouseOver: Function;
    onClick?: Function
    to: string;
}

export const Channel =  forwardRef((props: ChannelProps, ref: any) => {
    const location = useLocation()

    return (
            <Divver onClick={() => props.onClick && props.onClick()} to={`/app/${location.pathname.split('/')[2]}/${props.to}`} ref={ref} onMouseOver={() => {props.onMouseOver()}} >
                {
                    typeof props.icon === 'string'
                        ? <img src={props.icon} alt={props.name} />
                        : props.icon
                }
                { props.name }
            </Divver>
        )
    }
)