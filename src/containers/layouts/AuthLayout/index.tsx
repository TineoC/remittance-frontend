import { Outlet } from "react-router";
import Layout from "./AuthLayout";

const AuthLayout: React.FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default AuthLayout;
