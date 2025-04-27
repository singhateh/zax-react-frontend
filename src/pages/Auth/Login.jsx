import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginSVG from "../../assets/images/login-page.png";
import LoginLogoIcon from '../../assets/logo.png';
import api from "../../services/api";
import { useStateContext } from "../../contex/ContexProvider";
import { FiAlertCircle, FiX, FiLoader, FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
    const [error, setError] = useState("");
    const [identifier, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setUser, setToken, setSelectedDoctor, setDoctors } = useStateContext();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!identifier || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await api.post('/login', {
                identifier,
                password,
                rememberMe
            });

            if (response.data) {
                setSelectedDoctor(response.data.doctor);
                setDoctors(response.data.doctors);
                setUser(response.data.user);
                setToken(response.data.token);
                navigate('/doctors');
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-gray-50 overflow-x-hidden">
            {/* Left Panel - Form (Full width on mobile, half width on desktop) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
                <div className="w-full max-w-md mx-auto space-y-6 md:space-y-8">
                    {/* Logo and Heading */}
                    <div className="text-center">
                        <img
                            src={LoginLogoIcon}
                            alt="Logo"
                            className="mx-auto h-14 sm:h-16 md:h-20 w-auto"
                        />
                        <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                            Welcome Back
                        </h1>
                        <p className="mt-2 text-sm sm:text-base md:text-lg text-gray-600">
                            Please sign in to your account
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="rounded-md bg-red-50 p-3 sm:p-4 w-full">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <FiAlertCircle className="h-5 w-5 text-red-400" />
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm sm:text-base text-red-700">{error}</p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <button
                                        onClick={() => setError("")}
                                        className="text-red-500 hover:text-red-700 focus:outline-none"
                                        aria-label="Close error message"
                                    >
                                        <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <form className="mt-6 w-full space-y-4 md:space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-3 md:space-y-4 w-full">
                            {/* Email Input */}
                            <div className="w-full">
                                <label
                                    htmlFor="email"
                                    className="block text-sm sm:text-base md:text-lg font-medium text-gray-700"
                                >
                                    Email address
                                </label>
                                <div className="mt-1 relative w-full">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={identifier}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm 
                                        focus:border-indigo-500 focus:ring-indigo-500 p-2.5 sm:p-3 md:p-3.5 border 
                                        text-sm sm:text-base md:text-lg"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="w-full">
                                <label
                                    htmlFor="password"
                                    className="block text-sm sm:text-base md:text-lg font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <div className="mt-1 relative w-full">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm 
                                        focus:border-indigo-500 focus:ring-indigo-500 p-2.5 sm:p-3 md:p-3.5 border 
                                        text-sm sm:text-base md:text-lg pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <FiEyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <FiEye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                        className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-300 text-indigo-600 
                                        focus:ring-indigo-500"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm sm:text-base md:text-lg text-gray-700"
                                    >
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm sm:text-base md:text-lg">
                                    <a
                                        href="#"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="w-full">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full justify-center rounded-md border cursor-pointer
                                border-transparent bg-indigo-600 py-2.5 sm:py-3 md:py-3.5 px-4 text-sm sm:text-base md:text-lg font-medium 
                                text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 
                                focus:ring-indigo-500 focus:ring-offset-2 transition-colors ${loading ? 'opacity-80 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <FiLoader className="animate-spin mr-2 h-4 w-4 sm:h-5 sm:w-5 inline" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Panel - Illustration (Hidden on mobile, full height on desktop) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-200 to-white">

                <div className="w-full h-full flex items-center justify-center p-8 xl:p-12 2xl:p-16">
                    <img
                        src={LoginSVG}
                        alt="Login illustration"
                        className="w-full h-full max-w-full max-h-full object-contain"
                    />
                </div>
            </div>
        </div>
    );
}