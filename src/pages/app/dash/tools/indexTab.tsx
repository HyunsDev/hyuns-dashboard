import { useContext } from "react";
import { FilePlus, MagnifyingGlass } from 'phosphor-react'

import { TabDivver, H1 } from "../../../../components/Tab";
import { ModalContext } from "../../../../context/modalContext";

import { Items } from "../../../../components";
import { CreateJwtModal } from "./modal/createJWTModal";

export function IndexTab() {
    const modal = useContext(ModalContext)
    
    return (
        <TabDivver>
            <H1>도구</H1>

            <Items data={[
                [
                    {
                        type: 'avatar',
                        name: 'JWT',
                        label: 'JWT 관련 도구',
                        icon: 'http://jwt.io/img/icon.svg'
                    },
                    {
                        type: 'buttons',
                        button: [[
                            {
                                icon: <MagnifyingGlass />,
                                label: 'JWT 조회',
                                onClick: () => window.open('https://jwt.io/')
                            },
                            {
                                icon: <FilePlus />,
                                label: 'JWT 생성',
                                onClick: () => modal.open(<CreateJwtModal />)
                            }
                        ]]
                    }
                ]
            ]} />
        </TabDivver>
    )
}