import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const Workflows = lazy(() => import("../views/ui/Pipeline.js"))
const Upload = lazy(() => import("../views/ui/Create.js"))
const Resources = lazy(() => import("../views/ui/Resource.jsx"))

/*****Routes******/ 

const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/starter" /> },
      { path: "/starter", exact: true, element: <Starter /> },
      { path: "/pipeline", exact: true, element: <Workflows /> },
      { path: "/pipeline/create", exact: true, element: <Upload /> },
      { path: "/pipeline/create/resource", exact: true, element: <Resources /> },
    ],
  },
];

export default ThemeRoutes;
