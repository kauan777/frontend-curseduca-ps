import create from "zustand";
import { UserProps } from "../types/user";

type AuthenticationProps = {
  user: UserProps | null;
  setUser: (state: UserProps | null) => void;
};

export const useAuthentication = create<AuthenticationProps>((set) => ({
  user: null,
  setUser: (state: UserProps | null) => set({ user: state }),
}));
