import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { api } from "../../utils/api";
import Button from "../Button";

interface BoxCreatePost {
  getAllPosts(): void;
}

function BoxCreatePost({ getAllPosts }: BoxCreatePost) {
  const user = useAuthentication((state) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();

  async function handleCreatePost(data: any) {
    setIsLoading(true);

    const formData = new FormData();

    formData.append("content", data.content);
    formData.append("image", data.image[0]);

    try {
      await api
        .post(`/posts/${user?.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          toast.success("Postagem criada");
          getAllPosts();
          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        });
    } catch (err) {
      toast.error("Não foi possível criar a postagem");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleCreatePost)}
      className="bg-white shadow-md py-4 px-5 flex flex-col items-end w-full"
    >
      <div>
        <Toaster />
      </div>
      <div className="flex items-start gap-3">
        <Image
          className="w-[26px] h-[26px] md:w-[40px] md:h-[40px] rounded-full"
          width={40}
          height={40}
          src={
            user?.id
              ? `${api.getUri().toString()}/uploads/users/${user?.imagePath}`
              : "https://images.cws.digital/produtos/gg/75/53/bacia-vaso-sanitario-anturius-quadrado-cinza-prata-7595375-1616769362019.jpg"
          }
          alt={user?.name || "Foto de perfil"}
        />
        <textarea
          required
          placeholder="O que você está pensando?"
          {...register("content")}
          className="w-full h-[80px] md:h-fit outline-none border focus:border-[#0168EB] resize-none rounded bg-gray-200 py-3 px-4"
          rows={4}
          cols={50}
        ></textarea>
      </div>
      <div className="flex gap-4 mt-3 w-full md:w-[88%] md:justify-end">
        <input
          className="w-full px-5 py-2 rounded border border-[#959595] outline-none focus:border-[#0168EB]"
          type={"file"}
          {...register("image")}
          accept="image/png, image/jpeg, image/jpg"
          placeholder="Escolha uma foto"
        />
        <Button
          type="submit"
          disabled={isLoading}
          value={!isLoading ? "Publicar" : "Publicando"}
        />
      </div>
    </form>
  );
}

export default BoxCreatePost;
