import Image from "next/image";
import React, { useEffect, useState } from "react";
import pencil from "../../assets/icons/pencil.svg";
import trash from "../../assets/icons/trash.svg";
import heart from "../../assets/icons/heart-border.svg";
import heartFill from "../../assets/icons/heart-fill.svg";
import { PostProps } from "../../types/post";
import { api } from "../../utils/api";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { LikeProps } from "../../types/like";
import ModalDeletePost from "./ModalDeletePost";
import { formatDate } from "../../utils/formatDate";
import ModalUpdatePost from "./ModalUpdatePost";

interface PostComponentProps {
  post: PostProps;
  getAllPosts(): void;
}

function Post({ post, getAllPosts }: PostComponentProps) {
  const [isLiked, setIsLiked] = useState<boolean>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] =
    useState<boolean>(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] =
    useState<boolean>(false);
  const [amountLikes, setAmountLikes] = useState<number>(0);
  const user = useAuthentication((state) => state.user);

  const userAlreadyLiked = post.likes.some(
    (like) => like.authorId === user?.id
  );

  useEffect(() => {
    if (user?.id) {
      setIsLiked(userAlreadyLiked);
      setAmountLikes(post.likes.length);
    }
  }, [user]);

  async function handleLike() {
    //true
    if (!isLiked) {
      await api.post(`/likes`, {
        authorId: user?.id,
        postId: post.id,
      });
      setAmountLikes(amountLikes + 1);
      setIsLiked(true);
      getAllPosts();
      return;
    }
    const [like] = post.likes.filter(
      (like: LikeProps) => like.authorId === user?.id
    );
    await api.delete(`/likes/${like.id}`);
    setAmountLikes(amountLikes - 1);
    setIsLiked(false);
  }

  async function CloseDeleteModal() {
    setIsDeleteModalVisible(false);
  }

  async function CloseUpdateModal() {
    setIsUpdateModalVisible(false);
  }

  return (
    <section className="bg-white shadow-xl rounded mt-12 post">
      <ModalUpdatePost
        visible={isUpdateModalVisible}
        onClose={CloseUpdateModal}
        getAllPosts={getAllPosts}
        postId={post.id}
        content={post.content}
      />
      <ModalDeletePost
        visible={isDeleteModalVisible}
        postId={post.id}
        onClose={CloseDeleteModal}
        getAllPosts={getAllPosts}
      />
      <div className="flex items-center justify-between px-4 py-3">
        {/* USER INFORMATION */}
        <div className="flex gap-3 items-center">
          <Image
            className="object-cover rounded-full"
            src={
              user?.id
                ? `${api.getUri().toString()}/uploads/users/${
                    post.author.imagePath
                  }`
                : "https://images.cws.digital/produtos/gg/75/53/bacia-vaso-sanitario-anturius-quadrado-cinza-prata-7595375-1616769362019.jpg"
            }
            width={40}
            height={40}
            alt="Imagem do post"
          />
          <div className="flex flex-col ">
            <strong className="leading-none">{post.author.name}</strong>
            <small className="text-gray-400">
              {formatDate(post.createdAt)}
            </small>
          </div>
        </div>
        {post.authorId == user?.id && (
          <div className="flex gap-1 items-center">
            <button
              type="button"
              className="edit-icon"
              onClick={() => setIsUpdateModalVisible(true)}
            >
              <Image src={pencil} width={24} height={24} alt="Ícone Lápis" />
            </button>
            <button type="button" onClick={() => setIsDeleteModalVisible(true)}>
              <Image
                className="delete-icon"
                src={trash}
                width={24}
                height={24}
                alt="Ícone Lápis"
              />
            </button>
          </div>
        )}
      </div>

      <span className="block px-4 w-full mb-1">{post.content}</span>

      {post.imagePath !== "" && (
        <div className="relative w-full h-[300px]">
          <Image
            className="object-cover"
            src={`${api.getUri().toString()}/uploads/posts/${post.imagePath}`}
            fill
            alt="Imagem do post"
          />
        </div>
      )}
      <div className="w-full relative flex items-center  py-4 px-4 gap-1">
        <button className="relative w-[22px] h-[22px]" onClick={handleLike}>
          {isLiked ? (
            <Image
              src={heartFill}
              width={22}
              height={22}
              alt="ícone de curtida"
            />
          ) : (
            <Image src={heart} width={22} height={22} alt="ícone de curtida" />
          )}
        </button>
        <strong>{amountLikes}</strong>
      </div>
    </section>
  );
}

export default Post;
