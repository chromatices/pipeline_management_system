import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const Workflows = lazy(() => import("../views/ui/Workflows"))
const Upload = lazy(() => import("../views/ui/Create.js"))
const Resources = lazy(() => import("../views/ui/Resources.js"))

/*****Routes******/ 

const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/starter" /> },
      { path: "/starter", exact: true, element: <Starter /> },
      { path: "/workflows", exact: true, element: <Workflows /> },
      { path: "/workflows/create", exact: true, element: <Upload /> },
      { path: "/workflows/create/resources", exact: true, element: <Resources /> },
    ],
  },
];

export default ThemeRoutes;
