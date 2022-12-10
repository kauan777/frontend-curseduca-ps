import { Table, Row, Col, Tooltip, User } from "@nextui-org/react";
import { useFriendship } from "../../contexts/FriendshipContext";
import Image from "next/image";
import trash from "../../assets/icons/trash.svg";
import check from "../../assets/icons/check.svg";

import { api } from "../../utils/api";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { useEffect, useState } from "react";

export default function PendingsBox() {
  const user = useAuthentication((state) => state.user);
  const pendings = useFriendship((state) => state.pendings);
  const currentSection = useFriendship((state) => state.currentSection);

  const [isActionsClick, setIsActionsClick] = useState<boolean>(false);

  const updateFriendship = useFriendship((state) => state.updateFriendship);
  const deleteFriendship = useFriendship((state) => state.deleteFriendship);
  const setPendings = useFriendship((state) => state.setPendings);

  const getAllPendings = async (idUser: string) => {
    const { data } = await api.get(`/friendships/pendings/${idUser}`);
    setPendings(data);
    setIsActionsClick(false);
  };

  useEffect(() => {
    if (user?.id && isActionsClick) {
      console.log("entrou");
      getAllPendings(user?.id || "");
    }
  }, [isActionsClick]);


  useEffect(() => {
    if (currentSection == "pendings" && user?.id) {
      getAllPendings(user?.id || "");
    }
  }, [currentSection]);

  const columns = [
    { name: "Solicitações", uid: "pendings" },
    { name: "Ações", uid: "actions" },
  ];

  if (pendings?.pendings.length !== 0 && user?.id) {
    const renderCell = (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case "pendings":
          return (
            <User
              squared
              src={`${api.getUri().toString()}/uploads/users/${
                item?.sender.imagePath
              }`}
              name={item?.sender.name}
              css={{ p: 0 }}
            >
              {item?.sender.email}
            </User>
          );
        case "actions":
          return (
            <Row justify="center" align="center">
              <Col css={{ d: "flex", gap: 6 }}>
              <Tooltip content="Aceitar solicitação" color="success">
                  <button
                    type="button"
                    onClick={() => {
                      updateFriendship(item?.id).then(() =>setIsActionsClick(true) );
                    }}
                  >
                    <Image
                      src={check}
                      width={20}
                      height={20}
                      alt="Ícone Check"
                    />
                  </button>
                </Tooltip>
                <Tooltip content="Recusar solicitação" color="error">
                  <button
                    type="button"
                    onClick={() => {
                      deleteFriendship(item?.id).then(() =>setIsActionsClick(true) );
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
        <Table.Body items={pendings?.pendings || []}>
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

  if (pendings !== null || pendings == undefined) {
    return (
      <span className="block pl-4 text-gray-400">
        Nenhuma solicitação pendente 
      </span>
    );
  }
  return <span></span>;
}
