import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import AuthPage from "../pages/AuthPage";
import DashboardPage from "../pages/DashboardPage";
import HomePage from "../pages/HomePage";
import LessonPage from "../pages/LessonPage";
import VerbPage from "../pages/VerbPage";
import WordPages from "../pages/WordPages";
import PrivateRoute from "./PrivateRoute";

/* ---------------- Page Wrapper Helper ---------------- */
const withLayout = (element) => (
  <PrivateRoute>
    <Layout>{element}</Layout>
  </PrivateRoute>
);

/* ---------------- Router ---------------- */
export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/",
    element: withLayout(<HomePage />),
  },
  {
    path: "/lesson/:levelId/:day",
    element: withLayout(<LessonPage />),
  },
  {
    path: "/dashboard",
    element: withLayout(<DashboardPage />),
  },
  {
    path: "/verbs",
    element: withLayout(<VerbPage />),
  },
  {
    path: "/words",
    element: withLayout(<WordPages />),
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);
