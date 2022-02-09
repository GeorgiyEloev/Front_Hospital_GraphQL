import { Navigate } from "react-router-dom";
import Main from "./components/Main/Main";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";

const routes = () => [
  {
    path: "/main",
    element: localStorage.getItem("token") ? (
      <Main />
    ) : (
      <Navigate to="/login" />
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
];

export default routes;
