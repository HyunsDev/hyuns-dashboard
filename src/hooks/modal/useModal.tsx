import { useContext } from "react";
import { Code, ModalTitle, ModalTitleBox } from "../../components";
import { ModalContext } from "../../context/modalContext";


export function useModal() {
    return useContext(ModalContext)
}

export function useCodeModal() {
    const modal = useModal()

    return (title: string, code: any) => {
        modal.open(<>
            <ModalTitleBox>
                <ModalTitle>{ title }</ModalTitle>
            </ModalTitleBox>
            <Code>{JSON.stringify(code, null, 2)}</Code>
        </>)
    }
}