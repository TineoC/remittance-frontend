import { Role } from "../hooks/use-auth";
import CancelFileUpload from "../pages/CancelFileUpload";
import FileUpload from "../pages/FileUpload";
import NotAllowedPage from "../pages/NotAllowedPage";
import NotFoundPage from "../pages/NotFoundPage";
import SignInPage from "../pages/SignInPage";
import SubsidyInfoPage from "../pages/SubsidyInfoPage";
import AdminSendersPage from "../pages/admin/AdminSendersPage";
import AdminSubsidiesPage from "../pages/admin/AdminSubsidiesPage";

export type Route = {
  label?: string;
  href: string;
  showInSidebar?: boolean;
  roles?: Role | Role[];
  icon?: JSX.Element;
  page: JSX.Element;
};

export const authRoutes: Route[] = [
  {
    href: "/",
    page: <SignInPage />,
  },
  {
    href: "/not-allowed",
    page: <NotAllowedPage />,
  },
];

export const appRoutes: Route[] = [
  {
    label: "Consulta de Remesas",
    href: "/subsidy-info",
    icon: <i className="bi bi-info-circle-fill" />,
    roles: Role.Consultant,
    page: <SubsidyInfoPage />,
  },
  {
    label: "Envío de Remesas",
    href: "/remittances",
    icon: <i className="bi bi-currency-exchange" />,
    roles: Role.Operator,
    page: <FileUpload />,
  },
  {
    label: "Cancelación de Remesas",
    href: "/cancel-remittances",
    icon: <i className="bi bi-x-circle-fill" />,
    roles: Role.Operator,
    page: <CancelFileUpload />,
  },
  {
    label: "Administrar Organizaciones",
    href: "/admin-sender",
    icon: <i className="bi bi-building-fill" />,
    roles: Role.Maintainer,
    page: <AdminSendersPage />,
  },
  {
    label: "Subsidios",
    href: "/subsidies/:senderId",
    roles: Role.Maintainer,
    page: <AdminSubsidiesPage />,
    showInSidebar: false,
  },
  {
    href: "*",
    showInSidebar: false,
    page: <NotFoundPage />,
  },
];
