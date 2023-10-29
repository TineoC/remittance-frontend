import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { roleAtom } from "../../../hooks/use-roles/roleAtom";
import { Role } from "../../../hooks/use-auth";

interface IRolesAuthRouteProps {
  allowedRoles: Role | Role[];
}

export function RolesAuthRoute(props: IRolesAuthRouteProps) {
  const { allowedRoles } = props;
  const navigate = useNavigate();
  const [role] = useAtom(roleAtom);

  if (!role) return null;

  if (!allowedRoles.includes(role)) {
    navigate(-1);
  }

  return <Outlet />;
}
