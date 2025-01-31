import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import { imageUpload } from '../../Api/utils';
import GoogleLogin from '../../Shared/GoogleLogin';
import axios from 'axios';  // Import axios

const SignUp = () => {
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (event) => {
        event.preventDefault();
        setLoading(true);

        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const image = form.image.files[0];

        if (!image) {
            setLoading(false);
            return alert("Please upload an image!");
        }

        if (password.length < 6 || !/\d/.test(password)) {
            setLoading(false);
            return alert("Password must be at least 6 characters long and include a number!");
        }

        try {
            // Upload image to ImgBB
            const photoUrl = await imageUpload(image);
            console.log(photoUrl);

            // Create user with email and password
            const result = await createUser(email, password);
            if (!result?.user) throw new Error("User creation failed!");

            // Update user profile
            await updateUserProfile(name, photoUrl);

            // Send name, email, and image to the backend using axios
            const userData = {
                name,
                email,
                photoUrl,  // Send image URL from ImgBB
            };

            // Make a POST request to the backend
            const response = await axios.post(`http://localhost:5000/users/${email}`, userData);
            console.log("User data sent to the backend:", response.data);

            // Clear form and navigate
            form.reset();
            navigate("/");

        } catch (error) {
            console.error("Error signing up:", error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Create an Account</h2>
            <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-lg font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="image" className="block text-lg font-medium text-gray-700">Upload Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition-all duration-300"
                    disabled={loading}
                >
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
              <div className='flex justify-center'>
              <GoogleLogin></GoogleLogin>
              </div>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default SignUp;
