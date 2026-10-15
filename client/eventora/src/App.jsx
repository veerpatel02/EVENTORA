import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import EventDetail from "./pages/EventDetail";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

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
  path:"/events/:id",
  element: <EventDetail />
},
{
  path:"/dashboard",
  element: <UserDashboard />
},
{
  path:"/admindashboard",
  element: <AdminDashboard />
},
{
  path:"/paymentsuccess",
  element: <PaymentSuccess />
},
{
  path:"/paymentfailed",
  element: <PaymentFailed />    
}
])

const App = () =>{
  return <RouterProvider router={router} />;
}

export default App;
