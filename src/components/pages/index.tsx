import { createHashRouter } from "react-router-dom";
import Home from "./Home";
import ClReport from "../form/ClReport";

const router = createHashRouter([
  { path: "/", element: <Home /> },
  { path: "/checklist/:idCl?", element: <ClReport /> },
  {
    path: "*",
    element: <div>404 | Page not found.</div>,
  },
]);

export default router;
