import { IconContext } from "phosphor-react"
import styled from "styled-components"
import { StatusBadgeTag } from "../Badge/statusBadge"
import { ToolTip } from "../Tooltip/tooltip"

const ItemButton = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 120ms;
    opacity: 0;
`

const ItemButtons = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;

    @media ( max-width: 767px ) {
        width: 100%;
        align-items: flex-end;
        justify-content: flex-end;

        ${ItemButton} {
            opacity: 1;
        }
    }
`

const ItemDiv = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-right: solid 1px var(--gray4);
    border-left: solid 1px var(--gray4);
    border-top: solid 1px var(--gray4);

    @media ( max-width: 767px ) {
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 16px;
        gap: 8px;
    }


    &:first-child {
        border-top: none;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
`

const ItemsDiv = styled.div`
    margin-top: 8px;
    border-top: solid 1px var(--gray4);
    border-bottom: solid 1px var(--gray4);
    border-radius: 8px;

    ${ItemDiv}:hover ${ItemButton} {
        opacity: 1;
    }
`

const AvatarDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    width: 180px;
`

const AvatarIcon = styled.img`
    border-radius: 999px;
    background-color: var(--gray4);

    width: 36px;
    height: 36px;
`

const AvatarName = styled.div`
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
`

const AvatarLabel = styled.div`
    font-size: 12px;
    color: var(--gray5);
`

const StateDiv = styled.div`
    width: 120px;

    @media ( max-width: 767px ) {
        position: absolute;
        bottom: 12px;
        left: 16px;
    }
`

const TypeDiv = styled.div`
    color: var(--gray5);
    font-size: 12px;
    margin-left: 16px;
`

const TextsDiv = styled.div`
    flex: 1;
`

const TextDiv = styled.div`
    font-weight: 500;
    font-size: 14px;
`

const SubTextDiv = styled.div`
    color: var(--gray6);  
    font-size: 12px;  

`

interface Avatar {
    type: 'avatar'
    icon: string
    name: string
    label: string
}

interface Status {
    type: 'status'
    status: 'stateless' | 'error' | 'warning' | 'done'
}

interface Text {
    type?: 'text'
    text: string
    subText?: string
}

interface Buttons {
    type: 'buttons'
    button: {
        label: string
        onClick: Function
        icon: React.ReactElement
    }[]
}

type Item = (Avatar | Status | Text | Buttons)[]

interface Props {
    data: Item[]
}

const colorMap:((text: string) => 'red' | 'yellow' | 'green' | 'blue' | 'gray') = (text:string) => {
    const map:any= {
        stateless: 'gray',
        error: 'red',
        warning: 'yellow',
        done: 'blue',
    }
    return map[text] || 'gray'
}

function capitalize(str:string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}


export function Items(props: Props) {
    return (
        <ItemsDiv>
            <IconContext.Provider
                value={{
                    size: 20,
                    weight: 'bold',
                    color: 'var(--gray5)'
                }}    
            >
            {
                props.data.map((item, i) => (
                    <ItemDiv key={i}>
                        {
                            item.map((menu, ii) => {
                                if (menu.type === 'avatar') {
                                    return (
                                        <AvatarDiv key={ii}>
                                            <AvatarIcon src={menu.icon} alt="" />
                                            <div>
                                                <AvatarName>{menu.name}</AvatarName>
                                                <AvatarLabel>{menu.label}</AvatarLabel>
                                            </div>
                                        </AvatarDiv>
                                    )
                                } else if (menu.type === 'buttons') {
                                    return (
                                        <ItemButtons key={ii}>
                                            {
                                                menu.button.map((button, iii) => (
                                                    <ToolTip key={iii} text={button.label}><ItemButton onClick={() => button.onClick()}>{button.icon}</ItemButton></ToolTip>
                                                ))
                                            }
                                        </ItemButtons>
                                    )
                                } else if (menu.type === 'status') {
                                    return (
                                        <StateDiv key={ii}>
                                            <StatusBadgeTag hideBackground color={colorMap(menu.status.toLowerCase())} text={capitalize(menu.status)} />
                                            <TypeDiv>{menu.status}</TypeDiv>
                                        </StateDiv>
                                    )
                                } else {
                                    return (
                                        <TextsDiv key={ii}>
                                            <TextDiv>{menu.text}</TextDiv>
                                            {menu.subText && <SubTextDiv>{menu.subText}</SubTextDiv>}
                                        </TextsDiv>
                                    )
                                }

                            })
                        }
                    </ItemDiv>
                ))
            }
            </IconContext.Provider>
        </ItemsDiv>
    )
}

export type ItemsType = Item[]
export type ItemType = Item