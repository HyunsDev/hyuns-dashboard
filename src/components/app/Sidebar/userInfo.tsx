import styled from "styled-components";
import { Gear, SignOut } from 'phosphor-react'
import { ToolTip } from "../../Tooltip/tooltip";
import { ActionMenu } from "../../actionMenu";

interface UserInfoProps {
    title: string;
    subTitle: string;
    img: string;
}

const Divver = styled.div`
    padding: 12px 12px;
    transition: 100ms;
    height: 50px;
    min-height: 50px;
    border-top: solid 1px var(--gray4);
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Img = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 16px;
`

const Title = styled.div`
    font-size: 14px;
    font-weight: 700;
    line-height: 100%;
`

const SubTitle = styled.div`
    font-size: 12px;
    color: var(--gray5);
`

const UserInfoDivver = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`

const ImgDivver = styled.div`

`

const UserNameDivver = styled.div`

`

const SettingDivver = styled.div`
    padding: 4px;
    border-radius: 4px;
    cursor: pointer;
    transition: 100ms;
    width: 28px;
    height: 28px;
`

const logout = () => {
    localStorage.clear()
    window.location.href = '/login'
}

export function UserInfo(props: UserInfoProps) {
    return (
        <Divver>
            <UserInfoDivver>
                <ImgDivver>
                    <Img src={props.img} alt='프로필 이미지' />
                </ImgDivver>
                <UserNameDivver>
                    <Title>{props.title}</Title>
                    <SubTitle>{props.subTitle}</SubTitle>
                </UserNameDivver>
            </UserInfoDivver>
            
            <SettingDivver>
                <ActionMenu icon={<Gear weight="fill" color="var(--gray5)"/>} actions={[[
                    {
                        label: '로그아웃',
                        onClick: logout,
                        icon: <SignOut />,
                        color: 'red'
                    }
                ]]} />
            </SettingDivver>
        </Divver>
    )
}