import React from "react";
import { PostProps } from "../types/post";
import BoxCreatePost from "./BoxCreatePost";
import Post from "./Post";

interface FeedProp {
  posts: PostProps[];
  getAllPosts(): void;
}

function Feed({ posts, getAllPosts }: FeedProp) {
  return (
    <section className="max-w-[550px]">
      <BoxCreatePost getAllPosts={getAllPosts} />
      {posts.length > 0 &&
        posts.map((post) => (
          <Post key={post.id} post={post} getAllPosts={getAllPosts} />
        ))}
    </section>
  );
}

export default Feed;
