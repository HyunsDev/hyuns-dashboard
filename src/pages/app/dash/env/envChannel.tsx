import { useCallback, useContext, useState } from "react";
import { Code as CodeIcon, X, Pencil, Eye } from "phosphor-react";
import styled from "styled-components";
import { SearchBox } from "../../../../components/search/searchBox";
import { useQuery } from "react-query";
import axios from "axios";

import { H1, TabDivver } from "../../../../components/Tab";
import { Button, Checkbox } from "../../../../components/Input";
import { ModalContext } from "../../../../context/modalContext";
import { CreateModalView } from "./createModal";
import { RemoveModalView } from "./removeModal";
import { EditModalView } from "./editModal";
import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header";
import { Code } from "../../../../components/code/code";
import { FlexRow, Items } from "../../../../components";
import dayjs from "dayjs";
import { useCodeModal } from "../../../../hooks/modal/useModal";
import { ShowModalView } from "./showModal";

const Divver = styled.div`
    width: 100%;
`;

const Buttons = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    margin-top: 8px;
    gap: 8px;
`;

export function EnvChannel() {
    const [searchText, setSearchText] = useState("");
    const modal = useContext(ModalContext);
    const codeModal = useCodeModal();

    const {
        isLoading: varLoading,
        data: varData,
        refetch,
    } = useQuery(["env"], async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/env`, {
            headers: {
                Authorization: localStorage.getItem("token") || "",
            },
        });
        return res.data;
    });

    const createEnv = useCallback(() => {
        modal.open(<CreateModalView close={modal.close} refetch={refetch} />);
    }, [modal, refetch]);

    const removeEnv = useCallback(
        (key: string) => {
            modal.open(
                <RemoveModalView
                    varKey={key}
                    close={modal.close}
                    refetch={refetch}
                />
            );
        },
        [modal, refetch]
    );

    const editVar = useCallback(
        (initValue: {
            key: string;
            value: string;
            isPublic: boolean;
            isEncrypted: boolean;
            img?: string;
        }) => {
            modal.open(
                <EditModalView
                    close={modal.close}
                    refetch={refetch}
                    initValue={initValue}
                />
            );
        },
        [modal, refetch]
    );

    const showVar = useCallback(
        (value: {
            _id: string;
            createdAt: string;
            updatedAt: string;
            img: string;
            key: string;
            value: string;
        }) => {
            console.log(value);
            modal.open(<ShowModalView value={value} />);
        },
        [modal]
    );

    const items = varLoading
        ? []
        : varData
              .filter((e: any) => {
                  if (searchText === "") return true;
                  if (e.key.toUpperCase().includes(searchText.toUpperCase()))
                      return true;
                  if (e.value.toUpperCase().includes(searchText.toUpperCase()))
                      return true;
                  return false;
              })
              .map((item: any) => [
                  {
                      type: "avatar",
                      icon: item.img,
                      name: item.key,
                      label: dayjs(item.updatedAt).format("YY.MM.DD HH:mm"),
                  },
                  {
                      type: "buttons",
                      button: [
                          [
                              {
                                  label: "내용",
                                  icon: <Eye />,
                                  onClick: () => showVar(item),
                              },
                              {
                                  label: "Raw 보기",
                                  icon: <CodeIcon />,
                                  onClick: () => codeModal(`${item.key}`, item),
                              },
                              {
                                  label: "수정",
                                  icon: <Pencil />,
                                  onClick: () => editVar(item),
                              },
                          ],
                          [
                              {
                                  label: "삭제",
                                  icon: <X />,
                                  onClick: () => removeEnv(item.key),
                                  color: "red",
                              },
                          ],
                      ],
                  },
              ]);

    return (
        <Divver>
            <TabDivver>
                <H1>환경변수</H1>
                <Buttons>
                    <SearchBox value={searchText} onChange={setSearchText} />
                    <FlexRow>
                        <Button
                            label="환경변수 생성"
                            onClick={createEnv}
                            type={"button"}
                            color="black"
                        />
                    </FlexRow>
                </Buttons>

                <Items data={items} />
            </TabDivver>
        </Divver>
    );
}
