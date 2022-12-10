import React from "react";
import Image from "next/image";
import mockup from "../assets/images/mockup.png";
import BoxSignIn from "../components/BoxSignIn";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";

function Login() {
  return (
    <main className="flex w-full h-screen justify-center items-center ">
      <Image
        className="hidden md:block"
        src={mockup.src}
        width={577}
        height={516}
        alt="Mockup imagem celulares"
      />
      <BoxSignIn />
    </main>
  );
}

export default Login;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token_curseduca: token } = parseCookies(ctx);

  if (token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
