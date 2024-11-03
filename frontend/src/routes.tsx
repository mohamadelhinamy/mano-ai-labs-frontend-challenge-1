import { createBrowserRouter } from "react-router-dom";
import BasicLayout from "./layout/BasicLayout";
import NotFoundPage from "./pages/error/NotFound";
import MainPage from "./pages/index";
import MRFListPage from "./pages/mrfList";
import MRFDetailsPage from "./pages/mrfList/mrfDetails";

const router = createBrowserRouter([
  {
    element: <BasicLayout />,
    children: [
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/mrf-files",
        element: <MRFListPage />,
      },
      {
        path: "/mrf-files/:filename",
        element: <MRFDetailsPage />,
      }
    ],
    errorElement: <NotFoundPage />,
  },
]);

export default router;
