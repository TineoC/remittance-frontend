import { Outlet } from "react-router";
import Layout from "./LoggedInLayout";

const LoggedInLayout: React.FC = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default LoggedInLayout;
