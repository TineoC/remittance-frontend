import React from "react";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { type Route, appRoutes } from "../../utils/routes";
import { useAtom } from "jotai";
import { roleAtom } from "../../hooks/use-roles/roleAtom";

interface Props {
  className?: string;
}

export default function Sidebar(props: Props) {
  const { className } = props;
  const [role] = useAtom(roleAtom);

  if (!role) return null;

  const filteredRoutes = appRoutes.filter(({ showInSidebar, roles }) => {
    return showInSidebar !== false && (!roles || roles.includes(role));
  });

  return (
    <div className={clsx(className)}>
      <ul className="nav nav-pills py-3 flex-column row-gap-1">
        {filteredRoutes.map((link) => (
          <NavItem key={link.href} {...link} />
        ))}
      </ul>
    </div>
  );
}

function NavItem(props: Route) {
  const { href, icon, label } = props;
  const location = useLocation();
  const active = href === location.pathname;

  return (
    <li key={href} className="nav-item fw-bold">
      <Link
        to={href}
        className={clsx(
          "d-flex align-items-center column-gap-2 nav-link text-decoration-none",
          active && "text-white bg-primary"
        )}
      >
        {icon &&
          React.cloneElement(icon, {
            className: clsx(icon.props.className, "fs-5"),
          })}
        {label}
      </Link>
    </li>
  );
}
