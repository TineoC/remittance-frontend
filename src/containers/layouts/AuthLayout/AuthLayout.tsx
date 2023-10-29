import React, { PropsWithChildren } from "react";
import { Isotipo } from "../../../components/Logo";
import classes from "./AuthLayout.module.css";
import clsx from "clsx";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        backgroundImage: `url('/images/fondo_login.jpg')`,
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="container-fluid p-0"
    >
      <main
        className="d-flex flex-column text-white column-gap-5 align-items-center justify-content-center"
        style={{
          backgroundColor: "#00000070",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Isotipo size={100} />
        <h2 className="fs-2 fw-bold mb-5">Portal Remesas</h2>

        <article
          className={clsx(
            classes["form-container"],
            "d-flex gap-3 flex-column bg-white rounded-4 p-3 text-body"
          )}
        >
          {children}
        </article>
      </main>
    </div>
  );
}
