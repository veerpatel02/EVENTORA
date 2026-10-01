import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import EventDetail from "./pages/EventDetail";
import UserDashboard from "./pages/UserDashboard";

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
}
])

const App = () =>{
  return <RouterProvider router={router} />;
}

export default App;
