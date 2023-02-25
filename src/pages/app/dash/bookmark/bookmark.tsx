import { useCallback, useContext, useState } from "react";
import {
    Code as CodeIcon,
    X,
    Pencil,
    DotsThreeVertical,
    Table,
    SquaresFour,
} from "phosphor-react";
import styled from "styled-components";
import { SearchBox } from "../../../../components/search/searchBox";
import { useQuery } from "react-query";
import axios from "axios";

import { H1, TabDivver } from "../../../../components/Tab";
import { Checkbox } from "../../../../components/Input";
import { ModalContext } from "../../../../context/modalContext";
import { CreateModalView } from "./modal/createModal";
import { RemoveModalView } from "./modal/removeModal";
import { EditModalView } from "./modal/editModal";
import { ModalTitle, ModalTitleBox } from "../../../../components/Modal/Header";
import { Code } from "../../../../components/code/code";
import { FlexRow, Items, ItemsType } from "../../../../components";
import {
    ActionMenu,
    BoxLayout,
    Button,
    cv,
    Flex,
    ItemsTable,
    Link as A,
} from "opize-design-system";

type Bookmark = {
    id: string;
    key: string;
    title: string;
    subTitle: string;
    url: string;
    img?: string;
    memo?: string;
};
type BookmarkList = {
    [key: string]: Bookmark;
};

function BookmarkTableView({
    bookmarks,
    functions,
}: {
    bookmarks: Bookmark[];
    functions: {
        remove: (bookmark: Bookmark) => void;
        edit: (bookmark: Bookmark) => void;
        show: (value: any) => void;
    };
}) {
    return (
        <ItemsTable>
            {bookmarks.map((bookmark) => (
                <ItemsTable.Row>
                    <ItemsTable.Row.Avatar
                        icon={bookmark.img}
                        name={bookmark.title}
                        label={bookmark.id}
                    />
                    <ItemsTable.Row.Text
                        text={
                            <A href={bookmark.url} target="_blank">
                                {bookmark.url}
                            </A>
                        }
                    />
                    <ItemsTable.Row.Buttons
                        buttons={[
                            [
                                {
                                    label: "Raw 보기",
                                    icon: <CodeIcon />,
                                    onClick: () => functions.show(bookmark),
                                },
                                {
                                    label: "수정",
                                    icon: <Pencil />,
                                    onClick: () => functions.edit(bookmark),
                                },
                            ],
                            [
                                {
                                    label: "삭제",
                                    icon: <X />,
                                    onClick: () => functions.remove(bookmark),
                                    color: "red",
                                },
                            ],
                        ]}
                    />
                </ItemsTable.Row>
            ))}
        </ItemsTable>
    );
}

const BookmarkGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    gap: 20px;
`;
const StyledImage = styled.div``;

const Img = styled.img`
    width: 40px;
    aspect-ratio: 1/1;
    border-radius: 9999px;
    transition: 200ms;
`;
const ActionButtonDivver = styled.div`
    position: absolute;
    top: 0px;
    right: 0px;
    transition: 200ms;
    opacity: 0;
`;
const ImageLink = styled.a`
    display: flex;
    width: 100%;
    aspect-ratio: 1/1;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background-color: ${cv.bg_element2};
`;
const ImgWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    &:hover {
        ${Img} {
            transform: scale(1.1);
        }

        ${ActionButtonDivver} {
            opacity: 1;
        }
    }
`;
const ImageLabel = styled.div`
    text-align: center;
    font-size: 12px;
    color: ${cv.text3};
    width: 100%;
    word-break: break-all;
`;
function BookmarkGridView({
    bookmarks,
    functions,
}: {
    bookmarks: Bookmark[];
    functions: {
        remove: (bookmark: Bookmark) => void;
        edit: (bookmark: Bookmark) => void;
        show: (value: any) => void;
    };
}) {
    return (
        <BookmarkGrid>
            {bookmarks.map((bookmark) => (
                <StyledImage>
                    <ImgWrapper>
                        <ImageLink href={bookmark.url} target={"_blank"}>
                            <Img src={bookmark.img} />
                        </ImageLink>
                        <ActionButtonDivver>
                            <ActionMenu
                                icon={<DotsThreeVertical />}
                                variant="text"
                                actions={[
                                    [
                                        {
                                            label: "Raw 보기",
                                            icon: <CodeIcon />,
                                            onClick: () =>
                                                functions.show(bookmark),
                                        },
                                        {
                                            label: "수정",
                                            icon: <Pencil />,
                                            onClick: () =>
                                                functions.edit(bookmark),
                                        },
                                    ],
                                    [
                                        {
                                            label: "삭제",
                                            icon: <X />,
                                            onClick: () =>
                                                functions.remove(bookmark),
                                            color: "red",
                                        },
                                    ],
                                ]}
                            />
                        </ActionButtonDivver>
                    </ImgWrapper>
                    <Flex.Column>
                        <ImageLabel>{bookmark.title}</ImageLabel>
                    </Flex.Column>
                </StyledImage>
            ))}
        </BookmarkGrid>
    );
}

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

export function BookmarkChannel() {
    const [searchText, setSearchText] = useState("");
    const [viewType, setViewType] = useState<"table" | "grid">("grid");
    const modal = useContext(ModalContext);

    const { isLoading, data, refetch } = useQuery<BookmarkList>(
        ["bookmark"],
        async () => {
            const res = (
                await axios.get(
                    `${process.env.REACT_APP_API_URL}/dash/bookmark`,
                    {
                        headers: {
                            Authorization: localStorage.getItem("token") || "",
                        },
                    }
                )
            ).data as any;

            return res;
        }
    );

    const create = useCallback(() => {
        if (!data) return;
        modal.open(
            <CreateModalView
                prev={data}
                close={modal.close}
                refetch={refetch}
            />
        );
    }, [data, modal, refetch]);

    const remove = useCallback(
        (bookmark: Bookmark) => {
            modal.open(
                <RemoveModalView
                    prev={data}
                    id={bookmark.id}
                    close={modal.close}
                    refetch={refetch}
                />
            );
        },
        [data, modal, refetch]
    );

    const edit = useCallback(
        (initValue: Bookmark) => {
            if (!data) return;

            modal.open(
                <EditModalView
                    prev={data}
                    close={modal.close}
                    refetch={refetch}
                    initValue={initValue}
                />
            );
        },
        [data, modal, refetch]
    );

    const show = useCallback(
        (value: any) => {
            modal.open(
                <>
                    <ModalTitleBox>
                        <ModalTitle>변수 정보</ModalTitle>
                    </ModalTitleBox>
                    <Code>{JSON.stringify(value, null, 2)}</Code>
                </>
            );
        },
        [modal]
    );

    const _data =
        isLoading || !data
            ? []
            : (
                  Object.entries(data).map((e: any) => ({
                      id: e[0],
                      ...e[1],
                  })) as any
              ).filter((e: any) => {
                  if (searchText === "") return true;
                  if (e.id.toUpperCase().includes(searchText.toUpperCase()))
                      return true;
                  if (e.value.toUpperCase().includes(searchText.toUpperCase()))
                      return true;
                  return false;
              });

    return (
        <Divver>
            <TabDivver>
                <H1>북마크</H1>
                <Buttons>
                    <SearchBox value={searchText} onChange={setSearchText} />
                    <Flex.Row gap="8px">
                        <Button
                            icon={
                                viewType === "table" ? (
                                    <Table weight="regular" />
                                ) : (
                                    <SquaresFour weight="regular" />
                                )
                            }
                            onClick={() =>
                                setViewType(
                                    viewType === "grid" ? "table" : "grid"
                                )
                            }
                        />
                        <Button onClick={create} type={"button"}>
                            북마크 추가
                        </Button>
                    </Flex.Row>
                </Buttons>
            </TabDivver>
            <BoxLayout width="100%">
                {viewType === "table" ? (
                    <BookmarkTableView
                        bookmarks={_data}
                        functions={{
                            edit,
                            remove,
                            show,
                        }}
                    />
                ) : (
                    <BookmarkGridView
                        bookmarks={_data}
                        functions={{
                            edit,
                            remove,
                            show,
                        }}
                    />
                )}
            </BoxLayout>
        </Divver>
    );
}
