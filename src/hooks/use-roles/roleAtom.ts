import { atom } from "jotai";
import { Role } from "../use-auth";

export const roleAtom = atom<Role | undefined>({} as Role);
