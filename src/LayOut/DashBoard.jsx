import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaUser, FaSignOutAlt, FaClipboardList, FaAsterisk } from 'react-icons/fa';
import BecomeASeller from '../Pages/DashBoard/Customer/BecomeASeller/BecomeASeller';
import useAuth from '../Hooks/useAuth';
import useAxiosSecure from '../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import useRole from '../Hooks/useRole';

const SidebarItem = ({ to, icon: Icon, label }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? 'text-primary font-bold flex items-center gap-2 p-2 rounded '
          : 'flex items-center gap-2 p-2 rounded hover:bg-gray-200'
      }
    >
      <Icon />
      {label}
    </NavLink>
  </li>
);

const DashBoard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, isLoading] = useRole();
  const navigate=useNavigate()



  useEffect(() => {
    if (!isLoading && role === 'customer') {
      navigate('/dashboard/myOrders');
    }
    if (!isLoading && role === 'admin') {
      navigate('/dashboard/manageUsers');
    }
    if (!isLoading && role === 'seller') {
      navigate('/dashboard/addItem');
    }
  }, [role, isLoading, navigate]);


  // Function to open the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle sending request to become a seller
  const requestHandle = async () => {
    try {
      // Send request to the server
      const { data } = await axiosSecure.patch(`/users/${user?.email}`);
      console.log(data);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Request Sent!',
        text: 'Your request to become a seller has been sent successfully.',
        confirmButtonText: 'OK',
      });

      // Close the modal after success
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);

      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data || 'Something went wrong!',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div>
      <div className="flex h-screen">
        {/* Toggle Button for Mobile */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-full shadow-md"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Sidebar */}
        <div
          className={`lg:w-1/6 w-64 bg-base-200 p-4 h-full fixed lg:static z-40 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <ul className="menu text-base-content">
            {/* Role অনুযায়ী Sidebar Item দেখানো */}
            {role === 'admin' && (
              <>
                <SidebarItem to="/dashboard/statistics" icon={FaHome} label="Statistics" />
                <SidebarItem to="/dashboard/manageUsers" icon={FaHome} label="Manage Users" />
             
              </>
            )}

            {role === 'seller' && (
              <>
                <SidebarItem to="/dashboard/addItem" icon={FaClipboardList} label="Add Item" />
                <SidebarItem to="/dashboard/my-inventory" icon={FaClipboardList} label="My Inventory" />
                <SidebarItem to="/dashboard/mangeOrder" icon={FaClipboardList} label="Manage Orders" />
               
              </>
            )}

            {role === 'customer' && (
              <>
                <SidebarItem to="/dashboard/myOrders" icon={FaHome} label="My Orders" />
                {/* Become A Seller Button */}
                <button onClick={handleOpenModal}>
                  <SidebarItem icon={FaAsterisk} label="Become A Seller" />
                </button>
               
              </>
            )}
           <div className="divider"></div>
            {/* All Users */}
            <SidebarItem to="/" icon={FaHome} label="Home" />
            <SidebarItem to="/dashboard/profile" icon={FaUser} label="Profile" />
            <SidebarItem to="#" icon={FaSignOutAlt} label="Logout" />
          </ul>
        </div>

        {/* Dashboard Content */}
        <div
          className="flex-1 p-8 overflow-auto"
          onClick={() => isSidebarOpen && setIsSidebarOpen(false)} // Close sidebar on content click
        >
          <Outlet />
        </div>
      </div>

      {/* Become A Seller Modal */}
      {isModalOpen && <BecomeASeller requestHandle={requestHandle} onCancel={handleCloseModal} />}
    </div>
  );
};

export default DashBoard;
