import { useUserRoles } from "../use-roles";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../../utils/active-directory/config";
import { useEffect, useState } from "react";
import { roleAtom } from "../use-roles/roleAtom";
import { useAtom, useSetAtom } from "jotai";
import { userAtom } from "../use-auth/userAtom";
import { useNavigate } from "react-router-dom";
import { defaultRoute } from "../use-auth";

export function useAzureActiveDirectory() {
  const { instance } = useMsal();
  const setUser = useSetAtom(userAtom);
  const [role, setRole] = useAtom(roleAtom);
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { getUserRole } = useUserRoles();

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchUserRole(username: string): Promise<void> {
      const role = await getUserRole(username);
      if (!role) return;
      setRole(role);
    }

    const user = instance.getAllAccounts()[0];
    const username = user.username.split("@")[0];
    fetchUserRole(username);

    if (role === undefined) {
      return navigate("/not-allowed");
    }

    setUser(user);
    setRole(role);
    navigate(defaultRoute[role]);
  }, [instance, isAuthenticated, role, setRole, setUser]);

  async function loginWithActiveDirectory() {
    await instance.loginRedirect(loginRequest);
  }

  return { loginWithActiveDirectory };
}
