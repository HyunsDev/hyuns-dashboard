import { Link } from "react-router-dom";
import styled from "styled-components";
import { Logo } from "../../Logo/logo";
import { ToolTip } from "../../Tooltip/tooltip";


const Divver = styled.div`
    width: 58px;
    min-width: 58px;
    height: 100%;
    background-color: var(--gray1);
    padding: 8px 0px;

    display: flex;
    align-items: center;
    flex-direction: column;
`

// 서버 사이드바는 당장의 사용 계획이 없기 때문에 별도로 분리하지 않았습니다. (추후 확장을 위해 디자인됨)
// 만약 서버 사이드바를 사용하실 계획이 있다면 서버 아이콘을 별도 파일로 분리해주길 바랍니다.

const ServerIcon = styled.div`
    cursor: pointer;
    border-radius: 29px;
    transition: transform 100ms, border 200ms;
    width: 40px;
    height: 40px;
    box-sizing: content-box;
    border: solid 4px var(--blue1);

    &:hover {
        border: solid 4px var(--blue3);
    }

    &:active {
        transform: translateY(2px);
    }
`

const ServerIconLine = styled.div`
    width: 40px;
    margin: 4px 0px;
    border-bottom: solid 1px var(--gray4);
`

const ServerIconLink = styled(Link)`
    
`

interface ServerSidebarProps {
    servers: {
        [key: string]: {
            text: string,
            icon: React.ReactElement
            to: string
        }
    }
}

export function ServerSidebar(props: ServerSidebarProps) {

    return (
        <Divver>
            <ServerIconLink to={'/app/dash'}>
                <ToolTip text="Hyuns Dash" direction="right">
                    <ServerIcon>
                        <Logo size={40} isRounded />
                    </ServerIcon>
                </ToolTip>
            </ServerIconLink>
            <ServerIconLine />
            {
                Object.entries(props.servers).map(e => <>
                    <ServerIconLink to={`/app/${e[0]}`}>
                        <ToolTip text={e[1].text} direction="right">
                            <ServerIcon>
                                {e[1].icon}
                            </ServerIcon>
                        </ToolTip>
                    </ServerIconLink>
                </>)
            }
        </Divver>
    );
}
