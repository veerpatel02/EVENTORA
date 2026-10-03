import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            // =========================
            // LOGIN
            // =========================
            if (!showOTP) {
                const data = await login(email, password);

                console.log("Login successful:", data);

                if (data.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/dashboard");
                }
            }

            // =========================
            // VERIFY OTP
            // =========================
            else {
                if (!otp || otp.length !== 6) {
                    setError("Please enter the 6-digit OTP.");
                    return;
                }

                const data = await verifyOTP(email, otp);

                console.log("OTP verified:", data);

                if (data.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/dashboard");
                }
            }

        } catch (error) {
            console.error("Login error:", error);

            const backendError =
                error.response?.data?.error ||
                error.response?.data?.message;

            // Account is not verified
            if (error.response?.data?.needsVerification) {
                setShowOTP(true);
                setError(
                    backendError ||
                    "Your account is not verified. A new OTP has been sent to your email."
                );
            } else {
                setError(
                    backendError ||
                    error.message ||
                    "Login failed. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg border border-gray-100">

            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                    {showOTP ? "Verify Your Account" : "Welcome Back"}
                </h2>

                <p className="text-gray-500">
                    {showOTP
                        ? "Enter the OTP sent to your email"
                        : "Sign in to your Eventora account"
                    }
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {!showOTP ? (
                    <>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {/* OTP information */}
                        <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 text-sm">
                            A new OTP has been sent to:
                            <strong className="block mt-1">
                                {email}
                            </strong>
                        </div>

                        {/* OTP */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Verification Code
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                required
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6)
                                    )
                                }
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm font-bold tracking-widest text-center text-lg"
                            />
                        </div>

                        {/* Back to login */}
                        <button
                            type="button"
                            onClick={() => {
                                setShowOTP(false);
                                setOtp("");
                                setError("");
                            }}
                            className="w-full text-sm text-gray-600 hover:text-gray-900 hover:underline"
                        >
                            ← Back to login
                        </button>
                    </>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black focus:ring-4 focus:ring-gray-200 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading
                        ? "Processing..."
                        : showOTP
                            ? "Verify OTP & Log In"
                            : "Sign In"
                    }
                </button>
            </form>

            {/* Register link */}
            {!showOTP && (
                <p className="text-center mt-8 text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-gray-900 font-bold hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            )}

        </div>
    );
};

export default Login;