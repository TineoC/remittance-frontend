import React from "react";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { Isotipo } from "../Logo";
import { appRoutes } from "../../utils/routes";
import useAuth from "../../hooks/use-auth";
import { useAtom, useSetAtom } from "jotai";
import { userAtom } from "../../hooks/use-auth/userAtom";
import { useMsal } from "@azure/msal-react";
import { roleAtom } from "../../hooks/use-roles/roleAtom";

interface Props {
  className?: string;
}

export function Header(props: Props) {
  const { className } = props;

  return (
    <header className={clsx(className, "bg-primary px-5")}>
      <div className="d-flex h-100 py-2 flex-row align-items-center flex-wrap justify-content-center justify-content-between">
        <LogoAndMenu />

        <HeaderTitle />

        <Profile />
      </div>
    </header>
  );
}

function HeaderTitle() {
  const location = useLocation();

  const title =
    appRoutes.find(({ href }) => {
      return href === location.pathname;
    })?.label ?? "";

  return (
    <span className="d-none d-md-block fs-4 fw-bold text-white">{title}</span>
  );
}

function LogoAndMenu() {
  return (
    <aside className="d-flex flex-row align-items-center gap-3">
      <Link
        to="/"
        className="d-inline-flex link-body-emphasis text-decoration-none"
      >
        <Isotipo />
      </Link>
    </aside>
  );
}

function Profile() {
  const [user] = useAtom(userAtom);

  const profileName = user!.name || user!.username;

  return (
    <aside className="d-flex flex-row align-items-center gap-3 dropdown">
      {profileName && (
        <span className="d-none d-md-block text-white fw-bold">
          {profileName}
        </span>
      )}

      <div
        className="d-block link-body-emphasis text-decoration-none dropdown-toggle text-white"
        data-bs-toggle="dropdown"
        aria-expanded="true"
      >
        <img
          src="/images/avatar_placeholder.png"
          alt="Profile Avatar Placeholder"
          className="rounded-circle"
          width="40"
          height="40"
        />
      </div>

      <ProfileDropdown />
    </aside>
  );
}

function ProfileDropdown() {
  const { logoutFromEmail } = useAuth();
  const { instance } = useMsal();
  const setUser = useSetAtom(userAtom);
  const [, setRole] = useAtom(roleAtom);

  const handleLogout = () => {
    setUser(undefined);
    setRole(undefined);

    if (!sessionStorage.getItem("msal.account.keys")) {
      return logoutFromEmail();
    }

    instance.logoutRedirect();
  };

  return (
    <ul className="dropdown-menu text-small">
      <li>
        <Link
          to="/"
          className={clsx("dropdown-item", "text-danger")}
          onClick={handleLogout}
        >
          Cerrar sesión
        </Link>
      </li>
    </ul>
  );
}
