import { FcGoogle } from 'react-icons/fc';  // Correct import
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import useAuth from '../Hooks/useAuth';
import axios from 'axios';  // Import axios for sending data to the backend

const GoogleLogin = () => {
    const { googleSignIn, loading, user } = useAuth();  // Destructure user from useAuth
    const navigate = useNavigate();  // Use navigate hook

    // Handle Google Sign In
    const handleGoogleLogIn = async () => {
        try {
            // Perform Google sign-in
            const result = await googleSignIn();

            // Get user data from result
            const { displayName, email, photoURL } = result.user;

            // Prepare the data to be sent to the backend
            const userData = {
                name: displayName,
                email,
                photoUrl: photoURL,
            };

            // Send the user data to the backend
            await axios.post(`http://localhost:5000/users/${email}`, userData);  // Change backend URL if necessary

            // Navigate to home page after successful login
            navigate('/');  // You can change '/' to any route you'd like to navigate to
        } catch (error) {
            console.error("Google login error:", error);
            alert("Error logging in with Google");
        }
    };

    return (
        <div>
            <button
                onClick={handleGoogleLogIn}
                className="flex items-center px-10 py-3 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg hover:border-gray-400 transition duration-300 ease-in-out focus:outline-none"
                disabled={loading} // Disable button when loading
            >
                <FcGoogle className="text-2xl mr-3" /> {/* Google Icon */}
                <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>
        </div>
    );
};

export default GoogleLogin;
