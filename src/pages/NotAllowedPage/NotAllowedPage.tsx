import React from "react";
import { Link } from "react-router-dom";

export default function NotAllowedPage() {
  return (
    <div className="d-flex flex-column text-center">
      <h1 className="fs-4 fw-bold">No Permitido</h1>
      <h3 className="fs-5">Contacta con tu supervisor para solicitar acceso</h3>
      <Link className="btn btn-primary text-white mt-2" to="/">
        Volver al login
      </Link>
    </div>
  );
}
