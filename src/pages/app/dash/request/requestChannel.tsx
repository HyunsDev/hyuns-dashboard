import { useCallback, useContext, useState } from "react";
import { Code as CodeIcon, X, Pencil, Eye } from "phosphor-react";
import styled from "styled-components";
import { SearchBox } from "../../../../components/search/searchBox";
import { useQuery } from "react-query";
import axios from "axios";

import { H1, TabDivver } from "../../../../components/Tab";
import { Button } from "../../../../components/Input";
import { ModalContext } from "../../../../context/modalContext";
import { CreateModalView } from "./createModal";
import { RemoveModalView } from "./removeModal";
import { EditModalView } from "./editModal";
import { FlexRow, Items } from "../../../../components";
import { useCodeModal } from "../../../../hooks/modal/useModal";
import { ExecuteModalView } from "./executeModal";

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

const Pre = styled.pre`
  font-size: 14px;
`;

export function RequestChannel() {
  const [searchText, setSearchText] = useState("");
  const modal = useContext(ModalContext);
  const codeModal = useCodeModal();

  const { isLoading, data, refetch } = useQuery(["request"], async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/request`, {
      headers: {
        Authorization: localStorage.getItem("token") || "",
      },
    });
    return res.data.requests;
  });

  const createRequest = useCallback(() => {
    modal.open(<CreateModalView close={modal.close} refetch={refetch} />);
  }, [modal, refetch]);

  const removeRequest = useCallback(
    (id: string, name: string) => {
      modal.open(
        <RemoveModalView
          id={id}
          name={name}
          close={modal.close}
          refetch={refetch}
        />
      );
    },
    [modal, refetch]
  );

  const editRequest = useCallback(
    (initValue: {
      _id: string;
      name: string;
      url: string;
      method: string;
      body?: string;
      headers?: string;
      image?: string;
      memo?: string;
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

  const executeRequest = useCallback(
    (data: any) => {
      modal.open(
        <ExecuteModalView close={modal.close} refetch={refetch} data={data} />
      );
    },
    [modal, refetch]
  );

  const items = isLoading
    ? []
    : data
        .filter((e: any) => {
          if (searchText === "") return true;
          if (e.name.toUpperCase().includes(searchText.toUpperCase()))
            return true;
          if (e.url.toUpperCase().includes(searchText.toUpperCase()))
            return true;
          return false;
        })
        .map((item: any) => [
          {
            type: "avatar",
            icon: item.image,
            name: item.name,
            label: `${item.method} ${item.url}`,
          },
          {
            type: "buttons",
            button: [
              [
                {
                  label: "실행",
                  icon: <Eye />,
                  onClick: () => executeRequest(item),
                },
                {
                  label: "수정",
                  icon: <Pencil />,
                  onClick: () => editRequest(item),
                },
                {
                  label: "Raw 보기",
                  icon: <CodeIcon />,
                  onClick: () => codeModal(`${item._id}`, item),
                },
              ],
              [
                {
                  label: "삭제",
                  icon: <X />,
                  onClick: () => removeRequest(item._id, item.name),
                  color: "red",
                },
              ],
            ],
          },
        ]);

  return (
    <Divver>
      <TabDivver>
        <H1>리퀘스트</H1>
        <Buttons>
          <SearchBox value={searchText} onChange={setSearchText} />
          <FlexRow>
            <Button
              label="리퀘스트 생성"
              onClick={createRequest}
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
