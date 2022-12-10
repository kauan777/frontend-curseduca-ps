import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import React, { useEffect } from "react";
import FriendsBox from "../components/Friendships/FriendsBox";
import PendingsBox from "../components/Friendships/PendingsBox";
import SearchBox from "../components/Friendships/SearchBox";
import NavBar from "../components/NavBar";
import { useAuthentication } from "../contexts/AuthenticationContext";
import { useFriendship } from "../contexts/FriendshipContext";
import { FriendProps } from "../types/friend";
import { PendingProps } from "../types/pending";
import { UserProps } from "../types/user";
import { api } from "../utils/api";

interface FriendshipsProps {
  user: UserProps;
  friends: FriendProps[];
  pendingsData: PendingProps;
}

function friendships({ user, friends, pendingsData }: FriendshipsProps) {
  const setUser = useAuthentication((state) => state.setUser);
  const currentSection = useFriendship((state) => state.currentSection);
  const setCurrentSection = useFriendship((state) => state.setCurrentSection);
  const setFriends = useFriendship((state) => state.setFriends);
  const setPendings = useFriendship((state) => state.setPendings);
  const pendings = useFriendship((state) => state.pendings);

  useEffect(() => {
    setUser(user);
    setFriends(friends);
    setPendings(pendingsData);
  }, []);

  return (
    <>
      <NavBar content="friendships" />
      <main className="max-w-[1200px] py-14 mx-auto">
        <div className="flex w-full gap-3 mb-4 pl-4">
          <button
            type="button"
            className={currentSection == "friends" ? "font-bold" : ""}
            onClick={() => setCurrentSection("friends")}
          >
            Amigos
          </button>
          <span>|</span>
          <button
            type="button"
            className={
              currentSection == "pendings" ? "font-bold  relative" : "relative"
            }
            onClick={() => setCurrentSection("pendings")}
          >
            <span>Solicitações</span>
            {Number(pendings?.amountPendings) > 0 && (
              <div className="absolute flex items-center justify-center -top-[15px] text-white w-[18px] text-sm h-[18px] -right-[12px] bg-red-500 rounded-full">
                <span>{pendings?.amountPendings}</span>
              </div>
            )}
          </button>

          <span>|</span>
          <button
            type="button"
            className={currentSection == "search" ? "font-bold" : ""}
            onClick={() => setCurrentSection("search")}
          >
            Procurar
          </button>
        </div>
        {currentSection == "friends" && <FriendsBox />}
        {currentSection == "pendings" && <PendingsBox />}
        {currentSection == "search" && <SearchBox />}
      </main>
    </>
  );
}

export default friendships;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token_curseduca: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { data: user } = await api.get(`/auth/recovery/${token}`);

  const { data: friends } = await api.get(`/friendships/friends/${user.id}`);

  const { data: pendingsData } = await api.get(
    `/friendships/pendings/${user.id}`
  );

  return {
    props: { user, friends, pendingsData },
  };
};
