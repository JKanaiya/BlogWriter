import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Auth from "./components/Auth";
import Login from "./components/Login";
import { createBrowserRouter } from "react-router";
import ErrorPage from "./components/ErrorPage";
import { NewPost } from "./components/NewPost";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "new-post",
    element: <NewPost />,
    errorElement: <ErrorPage />,
  },
  {
    path: "auth",
    element: <Auth />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "log-in",
        element: <Login />,
      },
    ],
  },
]);

export default router;
