import React from "react";
import ReactDom from "react-dom";
import { api } from "../../utils/api";

interface ModalDeleteProps {
  visible: boolean;
  onClose(): void;
  getAllPosts(): void;
  postId: string;
}

function ModalDeletePost({
  visible,
  onClose,
  postId,
  getAllPosts,
}: ModalDeleteProps) {
  if (!visible || !postId) {
    return null;
  }

  async function handleDeleteModal() {
    await api.delete(`/posts/${postId}`);
    getAllPosts();
  }

  let container: any;
  if (typeof window !== "undefined") {
    const rootContainer = document.createElement("div");
    const parentElem = document.querySelector("#__next");
    parentElem?.appendChild(rootContainer);
    container = rootContainer;
  }

  return ReactDom.createPortal(
    <div className="my-blur fixed z-50 flex justify-center items-center left-0 top-0 px-4 bg-[#000000cc]  w-full h-full">
      <div className="bg-white  rounded-lg p-8 modal">
        <h3 className="block mb-4 text-xl">
          Deseja realmente excluir essa postagem?
        </h3>
        <div className="flex w-full  gap-4 justify-center">
          <button
            type="button"
            onClick={onClose}
            className="border font-semibold rounded border-zinc-600 px-11 py-3"
          >
            Voltar
          </button>
          <button
            onClick={handleDeleteModal}
            type="button"
            className="border font-semibold rounded text-white bg-red-500 px-11 py-3"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>,
    container
  );
}

export default ModalDeletePost;
