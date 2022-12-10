import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import Feed from "../components/Feed";
import NavBar from "../components/NavBar";
import { useAuthentication } from "../contexts/AuthenticationContext";
import { PostProps } from "../types/post";
import { UserProps } from "../types/user";
import { api } from "../utils/api";

interface HomeProps {
  user: UserProps;
  postsData: PostProps[];
}

export default function Home({ user, postsData }: HomeProps) {
  const setUser = useAuthentication((state) => state.setUser);

  const [posts, setPosts] = useState<PostProps[]>([]);

  useEffect(() => {
    setUser(user);
    setPosts(postsData);
  }, []);

  async function getAllPosts() {
    const { data } = await api.get(`/posts`);
    setPosts(data);
  }

  return (
    <>
      <NavBar content="index" />
      <main className="flex justify-center py-7 px-4">
        <Feed posts={posts} getAllPosts={getAllPosts} />
      </main>
    </>
  );
}

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

  const { data: postsData } = await api.get(`/posts`);

  return {
    props: { user, postsData },
  };
};
