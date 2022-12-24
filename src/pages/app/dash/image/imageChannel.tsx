import { useCallback, useContext, useState } from "react";
import { Download, ClipboardText, X, Code } from "phosphor-react";
import styled from "styled-components";
import { SearchBox } from "../../../../components/search/searchBox";
import { useQuery } from "react-query";
import axios from "axios";

import { H1, TabDivver } from "../../../../components/Tab";
import { ModalContext } from "../../../../context/modalContext";
import { CreateModalModalView } from "./createModal";
import { RemoveModalModalView } from "./removeModal";
import { toast, useToast } from "react-toastify";
import { ItemType, ItemsType, Items } from "../../../../components";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useCodeModal, useModal } from "../../../../hooks/modal/useModal";
import { Button, cv, Flex, Text } from "opize-design-system";
dayjs.locale("ko");

const Divver = styled.div`
    width: 100%;
`;

const Buttons = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    margin-top: 8px;
`;

const ImageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, auto));
    gap: 20px;
`;

function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const StyledImage = styled.div``;
const ImgWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    transition: 200ms;

    &:hover {
        transform: scale(0.97);
    }
`;
const ImageLabel = styled.div`
    text-align: center;
    font-size: 12px;
    color: ${cv.text3};
    width: 100%;
    word-break: break-all;
`;
const Img = styled.img`
    width: 100%;
    max-height: 70vh;
`;
function Image({
    ETag,
    Key,
    LastModified,
    Owner,
    Size,
    StorageClass,
    refetch,
}: {
    ETag: string;
    Key: string;
    LastModified: string;
    Owner: { ID: string };
    Size: number;
    StorageClass: string;
    refetch: () => void;
}) {
    const modal = useModal();

    const removeVar = useCallback(() => {
        modal.open(
            <RemoveModalModalView
                resourceKey={Key}
                close={modal.close}
                refetch={refetch}
            />
        );
    }, [Key, modal, refetch]);

    const onClick = () => {
        modal.open(
            <Flex.Column gap="20px">
                <Img src={`https://s3.hyuns.dev/${Key}`} />
                <Flex.Between>
                    <Flex.Column>
                        <Text size="12px">{Key}</Text>
                        <Text size="12px">{`${dayjs(LastModified).format(
                            "YY.MM.DD HH:mm:ss"
                        )} | ${formatBytes(Size)}`}</Text>
                    </Flex.Column>
                    <Flex.Row gap="8px">
                        <Button color="red" onClick={removeVar} variant="text">
                            삭제
                        </Button>
                        <Button
                            onClick={() => {
                                window.open(`https://s3.hyuns.dev/${Key}`);
                            }}
                        >
                            새 창에서 열기
                        </Button>
                        <Button
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    `https://s3.hyuns.dev/${Key}`
                                );
                                toast.info("클립보드에 복사했어요.");
                            }}
                        >
                            주소 복사
                        </Button>
                    </Flex.Row>
                </Flex.Between>
            </Flex.Column>
        );
    };

    return (
        <StyledImage>
            <ImgWrapper onClick={onClick}>
                <Img src={`https://s3.hyuns.dev/${Key}`} />
            </ImgWrapper>
            <ImageLabel>{Key}</ImageLabel>
        </StyledImage>
    );
}

export function ImageChannel() {
    const [searchText, setSearchText] = useState("");
    const modal = useContext(ModalContext);
    const codeModal = useCodeModal();

    const { isLoading, data, refetch } = useQuery(["resource"], async () => {
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/resource`,
            {
                headers: {
                    Authorization: localStorage.getItem("token") || "",
                },
            }
        );
        const content: {
            ETag: string;
            Key: string;
            LastModified: string;
            Owner: { ID: string };
            Size: number;
            StorageClass: string;
        }[] = res.data.fileList.Contents;
        return content;
    });

    const createVar = () => {
        modal.open(
            <CreateModalModalView close={modal.close} refetch={refetch} />
        );
    };

    return (
        <Divver>
            <TabDivver>
                <H1>리소스</H1>
                <Buttons>
                    <SearchBox value={searchText} onChange={setSearchText} />
                    <Button onClick={createVar}>리소스 업로드</Button>
                </Buttons>
                <ImageGrid>
                    {data
                        ?.filter((e) => e.Key.endsWith(".png"))
                        .map((e) => (
                            <Image {...e} refetch={refetch} />
                        ))}
                </ImageGrid>
            </TabDivver>
        </Divver>
    );
}
