import logo from "../assets/images/logo.png";
import { Navbar, Link, Text, Avatar, Dropdown } from "@nextui-org/react";
import { useAuthentication } from "../contexts/AuthenticationContext";
import { api } from "../utils/api";
import { destroyCookie } from "nookies";
import { useRouter } from "next/router";
export default function NavBar() {
  const user = useAuthentication((state) => state.user);
  const setUser = useAuthentication((state) => state.setUser);

  const collapseItems = [
    {
      description: "Feed",
      link: "/",
    },
    {
      description: "Amigos",
      link: "/friends",
    },
  ];

  const router = useRouter();

  function logout() {
    setUser(null);
    destroyCookie(null, "token_curseduca");
    router.push("/login");
  }

  return (
    <Navbar id="navbar" isBordered variant="sticky">
      <Navbar.Toggle showIn="xs" />
      <Navbar.Brand
        css={{
          "@xs": {
            w: "12%",
          },
        }}
      >
        <img
          className="mb-4 mt-3"
          src={logo.src}
          width={100}
          height={30}
          alt="Logo Curseduca"
        />
      </Navbar.Brand>
      <Navbar.Content
        activeColor="default"
        hideIn="xs"
        variant="highlight-rounded"
      >
        <Navbar.Link isActive href="/">
          Feed
        </Navbar.Link>
        <Navbar.Link href="/">Amigos</Navbar.Link>
      </Navbar.Content>
      <Navbar.Content
        css={{
          "@xs": {
            w: "12%",
            jc: "flex-end",
          },
        }}
      >
        <Dropdown placement="bottom-right">
          <Navbar.Item>
            <Dropdown.Trigger>
              <Avatar
                bordered
                as="button"
                color="gradient"
                size="md"
                src={
                  user?.id
                    ? `${api.getUri().toString()}/uploads/users/${
                        user?.imagePath
                      }`
                    : "https://images.cws.digital/produtos/gg/75/53/bacia-vaso-sanitario-anturius-quadrado-cinza-prata-7595375-1616769362019.jpg"
                }
              />
            </Dropdown.Trigger>
          </Navbar.Item>
          <Dropdown.Menu
            aria-label="User menu actions"
            color="default"
            onAction={(actionKey) => console.log({ actionKey })}
          >
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
              <Text b color="inherit" css={{ d: "flex" }}>
                {user?.name}
              </Text>
              <Text color="inherit" css={{ d: "flex" }}>
                {user?.email}
              </Text>
            </Dropdown.Item>
            <Dropdown.Item key="logout" withDivider color="error">
              <button className=" w-full text-left" onClick={logout}>
                Sair da conta
              </button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Content>
      <Navbar.Collapse>
        {collapseItems.map((item, index) => (
          <Navbar.CollapseItem
            key={item.description}
            activeColor="default"
            css={{
              color: index === collapseItems.length - 1 ? "" : "",
            }}
            isActive={index === 0}
          >
            <Link
              color="inherit"
              css={{
                minWidth: "100%",
              }}
              href={item.link}
            >
              {item.description}
            </Link>
          </Navbar.CollapseItem>
        ))}
      </Navbar.Collapse>
    </Navbar>
  );
}
