import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const ErrorPage = ({ errorCode = "404" }) => {
    const is404 = errorCode === "404";
    const errorMessage = is404
        ? "Oops! The page you’re looking for doesn’t exist or has been moved."
        : "Something went wrong! We're working to fix it as soon as possible.";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-100 px-4 py-10">
            <style>
                {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }

          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-fade-in {
            animation: fadeInUp 0.8s ease-out forwards;
          }
        `}
            </style>

            <div className="relative bg-white/80 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-6 sm:p-10 max-w-lg w-full text-center animate-fade-in">
                <div className="flex justify-center mb-6">
                    <div className={`bg-${is404 ? "red" : "yellow"}-100 p-4 sm:p-5 rounded-full shadow-md animate-float`}>
                        <AlertTriangle size={48} className={`text-${is404 ? "red" : "yellow"}-500`} />
                    </div>
                </div>

                <h1 className="text-6xl sm:text-7xl font-extrabold text-gray-800 tracking-wide mb-2">
                    {errorCode}
                </h1>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-4">
                    {is404 ? "Page Not Found" : "Internal Server Error"}
                </h2>

                <p className="text-gray-600 mb-6 text-base sm:text-lg leading-relaxed px-2">
                    {errorMessage}
                </p>

                <Link
                    to="/dashboard"
                    className="inline-block px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-full shadow-lg transition duration-300 hover:scale-105"
                >
                    Back to Dashboard
                </Link>

                <div className="mt-8 text-xs sm:text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-600">Zax Technologies</span>. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
