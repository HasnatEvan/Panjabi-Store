import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import GoogleLogin from "../../Shared/GoogleLogin";

const Login = () => {
    const { loginUser, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogIn = async (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            // Attempt login
            const result = await loginUser(email, password);
            if (result?.user) {
                navigate("/");  // Redirect to dashboard on successful login
            } else {
                alert("Invalid credentials!"); // Handle login failure
            }
        } catch (error) {
            console.error("Login error:", error.message);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
                <form onSubmit={handleLogIn} className="mt-6">
                    {/* Email Input */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                    {/* Password Input */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                            required
                        />
                    </div>
                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                            disabled={loading}  // Disable button while loading
                        >
                            {loading ? "Logging In..." : "Login"}
                        </button>
                        <div className='flex justify-center'>
                            <GoogleLogin></GoogleLogin>
                        </div>
                    </div>
                </form>
                {/* Extra Options */}
                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link to={'/signup'} className="text-blue-500 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
