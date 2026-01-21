import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./App.css";
import RootLayout from "./pages/RootLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateSurvey from "./pages/CreateSurvey";
import EditSurvey from "./pages/EditSurvey";
import SurveyView from "./pages/SurveyView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <Login /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "create", element: <CreateSurvey /> },
      { path: "edit/:id", element: <EditSurvey /> },
    ],
  },
  {
    path: "/survey/:id",
    element: <SurveyView />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
