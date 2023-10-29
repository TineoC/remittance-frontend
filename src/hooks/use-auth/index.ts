import { useSetAtom } from "jotai";
import { userAtom } from "./userAtom";
import { useNavigate } from "react-router-dom";
import { roleAtom } from "../use-roles/roleAtom";

export const defaultRoute: Record<Role, string> = {
  Operaciones: "/remittances",
  Consultas: "/subsidy-info",
  Mantenimiento: "/admin-sender",
};

export default function useAuth() {
  const navigate = useNavigate();
  const setUser = useSetAtom(userAtom);
  const setRole = useSetAtom(roleAtom);

  function loginWithEmail(username: string, password: string): void {
    try {
      const user = usersList.find((user) => {
        return user.username === username && user.password === password;
      });

      if (!user) throw new Error("Credenciales invalidas");

      const role = user.role;
      setUser(user);
      setRole(role);

      navigate(defaultRoute[role]);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async function logoutFromEmail(): Promise<void> {
    setUser(undefined);
    setRole("" as Role);
  }

  return {
    loginWithEmail,
    logoutFromEmail,
  };
}

export enum Role {
  Consultant = "Consultas",
  Operator = "Operaciones",
  Maintainer = "Mantenimiento",
}

export type User = {
  name: string;
  username: string;
  password: string;
  token: string;
  role: Role;
};

const ADMIN_USER: User = {
  name: "Operador de Remesas",
  username: "operador",
  password: "operador@brrd2023",
  role: Role.Operator,
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.T26Dm4buOBRdxNs58srk1l_N5y1Dxii9y-YMj-9J7mM",
};

const READ_USER: User = {
  name: "Consultor de Remesas",
  username: "consultor",
  password: "consultor@brrd1234",
  role: Role.Consultant,
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImNvbnN1bHRhbnQiLCJpYXQiOjE1MTYyMzkwMjJ9._N7rsT83mVm38FZsCbbeEcwijGahof4DYtU7eqCwu5Y",
};

const MANTAINER_USER: User = {
  name: "Configurador de Remesas Internas",
  username: "mantenimiento",
  password: "mantenimiento@brrd4321",
  role: Role.Maintainer,
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Im1hbnRhaW5lciIsImlhdCI6MTUxNjIzOTAyMn0.RLkq5WW6w_QdCHApAU_BhLs7p4D21Q6WIV8DiYZ4KNM",
};

const usersList = [ADMIN_USER, READ_USER, MANTAINER_USER];
