import { LikeProps } from "./like";

export interface PostProps {
  id: string;
  content: string;
  imagePath: string;
  authorId: string;
  createdAt: string;
  author: {
    name: string;
    imagePath: string;
  };
  likes: LikeProps[];
}
