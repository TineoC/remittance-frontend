import { AccountInfo } from "@azure/msal-browser";
import { atomWithStorage } from "jotai/utils";
import { User } from ".";

export const userAtom = atomWithStorage<
  (AccountInfo | User) | undefined | null
>("user", undefined);
