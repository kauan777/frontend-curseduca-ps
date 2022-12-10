import ReactDom from "react-dom";
import { api } from "../../utils/api";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";

interface ModalUpdateProps {
  visible: boolean;
  onClose(): void;
  getAllPosts(): void;
  postId: string;
  content: string;
}

function ModalUpdatePost({
  visible,
  onClose,
  postId,
  content,
  getAllPosts,
}: ModalUpdateProps) {
  if (!visible || !postId || !content) {
    return null;
  }

  const { register, handleSubmit } = useForm();

  async function handleUpdateModal(data: any) {
    if (data.content) {
      console.log(data.content);
      await api.patch(`/posts/${postId}`, {
        content: data.content,
      });
      toast.success("Atualizado com sucesso");

      getAllPosts();
      setTimeout(() => {
        onClose();
      }, 700);
    }
  }

  let container: any;
  if (typeof window !== "undefined") {
    const rootContainer = document.createElement("div");
    const parentElem = document.querySelector("#__next");
    parentElem?.appendChild(rootContainer);
    container = rootContainer;
  }

  return ReactDom.createPortal(
    <div className="my-blur fixed z-50 flex justify-center items-center left-0 top-0 bg-[#000000cc] px-4  w-full h-full">
      <div>
        <Toaster />
      </div>
      <form
        onSubmit={handleSubmit(handleUpdateModal)}
        className="bg-white  rounded-lg p-8  flex flex-col gap-5"
      >
        <span>Altere a descrição da sua postagem</span>

        <input
          required
          defaultValue={content}
          {...register("content")}
          className="w-full px-5 py-3  border border-[#959595] outline-none focus:border-[#0168EB] rounded"
        />
        <div className="flex w-full  gap-4 justify-center">
          <button
            type="button"
            onClick={onClose}
            className="border font-semibold rounded border-zinc-600 px-11 py-3"
          >
            Voltar
          </button>
          <input
            onClick={handleUpdateModal}
            type="submit"
            value={"Confirmar"}
            className="border font-semibold rounded text-white my-linear-gradient px-11 py-3 cursor-pointer"
          />
        </div>
      </form>
    </div>,
    container
  );
}

export default ModalUpdatePost;
