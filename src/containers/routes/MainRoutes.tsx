import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import AuthLayout from "../layouts/AuthLayout";
import LoggedInLayout from "../layouts/LoggedInLayout";
import { RolesAuthRoute } from "../layouts/RolesAuthRoute";
import { authRoutes, appRoutes } from "../../utils/routes";

const MainRoutes: React.FC = () => {
  const renderAuthRoutes = () => {
    return authRoutes.map(({ href, page }) => (
      <Route key={href} path={href} element={page} />
    ));
  };

  const renderAppRoutes = () => {
    return appRoutes.map(({ href, roles, page }) => (
      <Route
        key={href}
        element={roles && <RolesAuthRoute allowedRoles={roles} />}
      >
        <Route path={href} element={page} />
      </Route>
    ));
  };

  return (
    <Suspense fallback={<Spinner animation="border" variant="primary" />}>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>{renderAuthRoutes()}</Route>
          <Route element={<LoggedInLayout />}>{renderAppRoutes()}</Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default MainRoutes;
