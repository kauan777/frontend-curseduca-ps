import { Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";
import { useFriendship } from "../../contexts/FriendshipContext";
import Image from "next/image";
import trash from "../../assets/icons/trash.svg";

import { api } from "../../utils/api";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { useEffect, useState } from "react";

export default function FriendsBox() {
  const user = useAuthentication((state) => state.user);
  const friends = useFriendship((state) => state.friends);
  const currentSection = useFriendship((state) => state.currentSection);

  const [isDeleteClick, setIsDeleteClick] = useState<boolean>(false);

  const deleteFriendship = useFriendship((state) => state.deleteFriendship);
  const setFriends = useFriendship((state) => state.setFriends);

  const getAllFriends = async (idUser: string) => {
    const { data } = await api.get(`/friendships/friends/${idUser}`);
    setFriends(data);
    setIsDeleteClick(false);
  };

  useEffect(() => {
    if (user?.id && isDeleteClick) {
      getAllFriends(user?.id || "");
    }
  }, [isDeleteClick]);

  useEffect(() => {
    if (currentSection == "friends" && user?.id) {
      getAllFriends(user?.id || "");
    }
  }, [currentSection]);



  if (friends?.length !== 0 && user?.id) {

    const columns = [
      { name: `Amigos (${friends?.length})`, uid: "friends" },
      { name: "Ações", uid: "actions" },
    ];

    const renderCell = (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case "friends":
          return (
            <User
              squared
              src={`${api.getUri().toString()}/uploads/users/${
                item?.friend.imagePath
              }`}
              name={item?.friend.name}
              css={{ p: 0 }}
            >
              {item?.friend.email}
            </User>
          );
        case "actions":
          return (
            <Row justify="center" align="center">
              <Col css={{ d: "flex" }}>
                <Tooltip content="Desfazer amizade" color="error">
                  <button
                    type="button"
                    onClick={() => {
                      deleteFriendship(item?.id).then(() =>
                        setIsDeleteClick(true)
                      );
                    }}
                  >
                    <Image
                      className="delete-icon"
                      src={trash}
                      width={24}
                      height={24}
                      alt="Ícone Lápis"
                    />
                  </button>
                </Tooltip>
              </Col>
            </Row>
          );
        default:
          return cellValue;
      }
    };

    return (
      <Table
        aria-label="Example table with custom cells"
        css={{
          height: "auto",
          minWidth: "100%",
        }}
        selectionMode="none"
      >
        <Table.Header columns={columns}>
          {columns.map((column) => (
            <Table.Column key={column.uid}>{column.name}</Table.Column>
          ))}
        </Table.Header>
        <Table.Body items={friends || []}>
          {(item: any) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }

  if (friends !== null || friends == undefined) {
    return (
      <span className="block pl-4 text-gray-400">
        Você não possui amigos :(
      </span>
    );
  }
  return <span></span>;
}
