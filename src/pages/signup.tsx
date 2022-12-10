import React from "react";
import Image from "next/image";
import mockup from "../assets/images/mockup.png";
import BoxSignUp from "../components/BoxSignUp";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";

function Login() {
  return (
    <main className="flex w-full h-screen justify-center items-center bg-[#FAFAFA] ">
      <Image
        className="hidden md:block"
        src={mockup.src}
        width={577}
        height={516}
        alt="Mockup imagem celulares"
      />
      <BoxSignUp />
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
