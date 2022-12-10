import { Col, Row, Table, Tooltip, User } from "@nextui-org/react";
import Image from "next/image";
import addUser from "../../../assets/icons/add-user.svg";
import search from "../../../assets/icons/search.svg";
import loading from "../../../assets/icons/loading.svg";

import { api } from "../../../utils/api";
import { useAuthentication } from "../../../contexts/AuthenticationContext";
import { useState } from "react";
import { SearchProps } from "../../../types/search";
import Input from "../../Input";
import { toast, Toaster } from "react-hot-toast";

export default function SearchBox() {
  const user = useAuthentication((state) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [results, setResults] = useState<SearchProps[] | null | []>(null);

  async function getResults() {
    if (text == "") {
      toast.error("Preencha o campo corretamente");
      return;
    }

    setIsLoading(true);
    const { data }: any = await api.get(`/friendships/search/${text}`);
    if (data.length > 0) {
      const dataFiltred = data.filter(
        (item: SearchProps) => item.id !== user?.id
      );
      setTimeout(() => setIsLoading(false), 200);

      setResults(dataFiltred);
      return;
    }
    setTimeout(() => setIsLoading(false), 400);
    setResults([]);
  }

  async function sendSolicitation(recipientId: string) {
    try {
      const { data }: any = await api.post(`/friendships`, {
        senderId: user?.id,
        recipientId: recipientId,
      });
      toast.success("Solicitação enviada")
    } catch {
      toast.error("Ação bloqueada");
    }
  }

  if (results !== null && results?.length !== 0 && user?.id) {
    const columns = [
      { name: `${results.length} Usuario(s) encontrado`, uid: "search" },
      { name: "Ações", uid: "actions" },
    ];

    const RenderCell = (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case "search":
          return (
            <User
              squared
              src={`${api.getUri().toString()}/uploads/users/${
                item?.imagePath
              }`}
              name={item?.name}
              css={{ p: 0 }}
            >
              {item?.email}
            </User>
          );
        case "actions":
          return (
            <Row justify="center" align="center">
              <Col css={{ d: "flex", gap: 6 }}>
                <Tooltip content="Enviar solicitação" color="primary">
                  <button
                    type="button"
                    onClick={() => {
                      sendSolicitation(item?.id);
                    }}
                  >
                    <Image
                      src={addUser}
                      width={20}
                      height={20}
                      alt="Adicionar usuário"
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
      <>
        <div>
          <Toaster />
        </div>
        <div className="flex px-4 md:px-0 mb-4">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite o nome do usuário..."
          />
          <button
            onClick={getResults}
            className=" flex items-center justify-center my-linear-gradient w-14"
          >
            {!isLoading ? (
              <Image src={search} width={24} height={24} alt="Ícone Lupa" />
            ) : (
              <Image
                className="loading"
                src={loading}
                width={24}
                height={24}
                alt="Ícone Lupa"
              />
            )}
          </button>
        </div>

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
          <Table.Body items={results || []}>
            {(item: any) => (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell>{RenderCell(item, columnKey)}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </>
    );
  }

  if (results !== null && results.length == 0) {
    return (
      <>
        <div className="flex px-4 md:px-0">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite o nome do usuário..."
          />
          <button
            onClick={getResults}
            className=" flex items-center justify-center my-linear-gradient w-14"
          >
            {!isLoading ? (
              <Image src={search} width={24} height={24} alt="Ícone Lupa" />
            ) : (
              <Image
                className="loading"
                src={loading}
                width={24}
                height={24}
                alt="Ícone Lupa"
              />
            )}
          </button>
        </div>
        <span className="block pl-4 pt-4 text-gray-400">
          Nenhum resulado encontrado
        </span>
      </>
    );
  }
  return (
    <div className="flex px-4 md:px-0">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Digite o nome do usuário..."
      />
      <button
        onClick={getResults}
        className=" flex items-center justify-center my-linear-gradient w-14"
      >
        {!isLoading ? (
          <Image src={search} width={24} height={24} alt="Ícone Lupa" />
        ) : (
          <Image
            className="loading"
            src={loading}
            width={24}
            height={24}
            alt="Ícone Lupa"
          />
        )}
      </button>
    </div>
  );
}
