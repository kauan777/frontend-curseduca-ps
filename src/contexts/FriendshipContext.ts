import create from "zustand";
import { FriendProps } from "../types/friend";
import { PendingProps } from "../types/pending";
import { api } from "../utils/api";

type FriendshipProps = {
  currentSection: "pendings" | "friends" | "search";
  setCurrentSection: (state: "pendings" | "friends" | "search") => void;

  friends: FriendProps[] | null;
  setFriends: (state: FriendProps[]) => void;

  pendings: PendingProps | null;
  setPendings: (state: PendingProps) => void;

  deleteFriendship(id: string): Promise<void>;
  
  updateFriendship(id: string): Promise<void>;
};

export const useFriendship = create<FriendshipProps>((set) => ({
  currentSection: "friends",
  setCurrentSection: (state: "pendings" | "friends" | "search") =>
    set({ currentSection: state }),

  friends: null,
  setFriends: (state: FriendProps[]) => set({ friends: state }),

  pendings: null,
  setPendings: (state: PendingProps) => set({ pendings: state }),

  deleteFriendship: async (id: string) => {
    await api.delete(`/friendships/${id}`);
  },

  updateFriendship: async (id: string) => {
    await api.patch(`/friendships/${id}`);
  },
}));
