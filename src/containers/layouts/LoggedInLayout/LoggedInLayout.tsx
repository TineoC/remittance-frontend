import React, { PropsWithChildren } from "react";
import Sidebar from "../../../components/Sidebar";
import classes from "./LoggedIn.module.css";
import clsx from "clsx";
import { Header } from "../../../components/Header";
import { Navigate } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom } from "../../../hooks/use-auth/userAtom";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const [user] = useAtom(userAtom);

  if (!user) return <Navigate to="/" />;

  return (
    <div className="cover-container d-flex flex-column bg-light vh-100">
      <Header className={clsx(classes.row)} />
      <div className="p-5 row row-gap-3 column-gap-lg-5 overflow-hidden">
        <Sidebar className="rounded-3 col col-xl-2 bg-white" />
        <main className="rounded-3 col-lg-9 flex-grow-1 bg-white p-5 h-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
