import { Role } from "../use-auth";

interface IIntranetRoles {
  name: string;
  id: string;
  permission: string;
  module: string;
  code: string;
  active: string;
}

export function useUserRoles() {
  const APP_NAME = "Motor Remesas Internas";

  async function getUserRole(username: string): Promise<Role | undefined> {
    const API_URL = `${process.env.REACT_APP_ENDPOINT_URL}Roles/${username}`;

    const response = await fetch(API_URL);

    const data: IIntranetRoles[] = await response.json();

    const permission = data.find(({ name }) => {
      return name === APP_NAME;
    });

    if (!permission) return undefined;

    const validRolePermission = checkUserRole(permission.code as Role);

    if (!validRolePermission) return undefined;

    return permission.code as Role;
  }

  function checkUserRole(userRole: Role): boolean {
    const validRoles = Object.values(Role);
    return validRoles.includes(userRole);
  }

  return { getUserRole };
}
