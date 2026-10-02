import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import EventDetail from "./pages/EventDetail";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const router = createBrowserRouter([
{
  path:"/",
  element: <Home />
  
},
{
  path:"/register",
  element: <Register />
},
{
  path:"/login",
  element: <Login />
},
{
  path:"/events",
  element: <EventDetail />
},
{
  path:"/dashboard",
  element: <UserDashboard />
},
{
  path:"/admindashboard",
  element: <AdminDashboard />
}
])

const App = () =>{
  return <RouterProvider router={router} />;
}

export default App;
