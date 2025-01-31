import {
    createBrowserRouter,
} from "react-router-dom";
import MainLayout from "../LayOut/MainLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import DashBoard from "../LayOut/DashBoard";
import AddItem from "../Pages/DashBoard/Seller/AddItem";
import PanjabiDetails from "../Pages/Home/PanjabiDetails";
import MyOrder from "../Pages/DashBoard/Customer/MyOrder/MyOrder";
import ManageUsers from "../Pages/DashBoard/Admin/ManageUsers/ManageUsers";
import PrivateRoute from "./PrivateRoute";
import SellerRoute from "./SellerRoute";
import AdminRoute from "./AdminRoute";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout></MainLayout>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/panjabi/:id',
                element: <PrivateRoute><PanjabiDetails></PanjabiDetails></PrivateRoute>
            },
            {
                path: '/login',
                element: <Login></Login>
            },
            {
                path: '/signup',
                element: <SignUp></SignUp>
            }
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><DashBoard></DashBoard></PrivateRoute>,
        children: [

            // Admin------------------------------------->
            {
                path: 'manageUsers',
                element: <PrivateRoute><AdminRoute><ManageUsers></ManageUsers></AdminRoute></PrivateRoute>
            },




            // Seller------------------------------------->
            {
                path: 'addItem',
                element: <PrivateRoute><SellerRoute><AddItem></AddItem></SellerRoute></PrivateRoute>
            },




            // Customer-------------------------->
            {
                path: 'myOrders',
                element:<PrivateRoute> <MyOrder></MyOrder></PrivateRoute>
            }
        ]
    }
]);
