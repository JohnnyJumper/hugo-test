import RegisterApplicationPage from "./pages/registerApplication.page";
import ApplicationPage from "./pages/application";
import { FC } from "react";

// interface
interface Route {
  key: string;
  title: string;
  path: string;
  enabled: boolean;
  component: FC<{}>;
}

export const routes: Array<Route> = [
  {
    key: "register-route",
    title: "Register",
    path: "/",
    enabled: true,
    component: RegisterApplicationPage,
  },
  {
    key: "application-route",
    title: "Application",
    path: "/application",
    enabled: true,
    component: ApplicationPage,
  },
];
