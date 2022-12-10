/* eslint-disable @next/next/no-img-element */
import logo from "../assets/images/logo.png";
import { useForm } from "react-hook-form";
import { api } from "../utils/api";
import { Toaster, toast } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/router";

function BoxSignUp() {
  const { register, handleSubmit } = useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleCreateAccount(data: any) {
    setIsLoading(true);
    if (data.password !== data.confirmPassword) {
      toast.error("As senhas não estão iguais");
      setIsLoading(false);

      return;
    }

    const formData = new FormData();

    formData.append("email", data.email);
    formData.append("name", data.name);
    formData.append("password", data.password);
    formData.append("image", data.image[0]);

    try {
      await api
        .post("/users", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          toast.success("Usuário cadastrado");

          setTimeout(() => {
            setIsLoading(false);
            router.push("/login");
          }, 2000);
        });
    } catch (err) {
      toast.error("Email já cadastrado");
      setIsLoading(false);
    }
  }

  return (
    <>
      <div>
        <Toaster />
      </div>

      <form
        onSubmit={handleSubmit(handleCreateAccount)}
        className="my-animation md:bg-white md:shadow-lg flex flex-col w-[370px] gap-4 items-center p-4 md:p-8 rounded"
      >
        <img
          className="mb-4"
          src={logo.src}
          width={147}
          height={52}
          alt="Logo Curseduca"
        />
        <input
          className="w-full px-5 py-3 rounded border border-[#959595] outline-none focus:border-[#0168EB]"
          required
          type={"text"}
          pattern="^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)"
          maxLength={32}
          placeholder="Digite seu nome e sobrenome"
          title="Digite seu nome e sobrenome corretamente"
          {...register("name")}
        />
        <input
          className="w-full px-5 py-3 rounded border border-[#959595] outline-none focus:border-[#0168EB]"
          required
          type={"email"}
          placeholder="Digite sua email"
          pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
          title="Email inválido"
          {...register("email")}
        />
        <input
          className="w-full px-5 py-3 rounded border border-[#959595] outline-none focus:border-[#0168EB]"
          required
          type={"password"}
          placeholder="Digite sua senha"
          {...register("password")}
        />
        <input
          className="w-full px-5 py-3 rounded border border-[#959595] outline-none focus:border-[#0168EB]"
          required
          type={"password"}
          minLength={5}
          placeholder="Digite sua senha novamente"
          {...register("confirmPassword")}
        />
        <div>
          <span className="text-gray-500 text-sm">
            Foto de perfil (opcional)
          </span>
          <input
            className="w-full px-5 py-3 rounded border border-[#959595] outline-none focus:border-[#0168EB]"
            type={"file"}
            {...register("image")}
            accept="image/png, image/jpeg, image/jpg"
            placeholder="Escolha uma foto"
          />
        </div>
        <input
          className="w-full py-3 rounded font-medium text-white my-linear-gradient disabled:opacity-90 transition-all cursor-pointer"
          type="submit"
          disabled={isLoading}
          value={!isLoading ? "Criar conta" : "Processando..."}
        />
      </form>
    </>
  );
}

export default BoxSignUp;
