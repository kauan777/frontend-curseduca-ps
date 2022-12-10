/* eslint-disable @next/next/no-img-element */
import Input from "./Input";
import logo from "../assets/images/logo.png";
import Button from "./Button";
import Link from "next/link";
import { api } from "../utils/api";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { Toaster, toast } from "react-hot-toast";

import { setCookie } from "nookies";
import { useAuthentication } from "../contexts/AuthenticationContext";

function BoxSignIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const setUser = useAuthentication((state) => state.setUser);

  const signIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth", {
        email,
        password,
      });
      setCookie(undefined, "token_curseduca", data.token, {
        maxAge: 60 * 60 * 1, // 1h
      });
      setUser(data.user);
      toast.success("Login realizado com sucesso");
    } catch {
      toast.error("Confira as informações");
      setIsLoading(false);
    }
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return (
    <form
      onSubmit={(e) => signIn(e)}
      className="my-animation md:bg-white md:shadow-lg flex flex-col w-[370px] gap-4 items-center p-4 md:p-8 rounded"
    >
      <div>
        <Toaster />
      </div>
      <img
        className="mb-4"
        src={logo.src}
        width={147}
        height={52}
        alt="Logo Curseduca"
      />
      <Input
        required
        type={"email"}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Digite seu email"
      />
      <Input
        required
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Digite sua senha"
      />
      <Button
        type="submit"
        disabled={isLoading}
        value={!isLoading ? "Entrar" : "Processando..."}
      />
      <div className="flex items-center w-full gap-4">
        <hr className="bg-gray-900 border  h-[1px] w-full" />
        <span className="text-gray-500">Ou</span>
        <hr className="bg-gray-900 border  h-[1px] w-full" />
      </div>
      <Link href="/signup" className="block w-full">
        <Button type="button" value="Criar conta" secondary />
      </Link>
    </form>
  );
}

export default BoxSignIn;
