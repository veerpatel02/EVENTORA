// import React from "react";
// import api from "../utils/axios.js";

// export const AuthContext = React.createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = React.useState(null);
//     const [loading, setLoding] = React.useState(true);

//     React.useEffect(() => {
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//         }
//         setLoding(false);
//     }, []);

//     const login = async (email, password) => {
//         try {
//             console.log("1.1")
//             const { data } = await api.post('/login', {
//                 email, password
//             });

//             console.log(data);
//             setUser(data);
            
//             localStorage.setItem("user", JSON.stringify(data));
//             localStorage.setItem("token", data.token);
             
//             return data;
           
//         } catch (error) {
//             console.error("Login failed", error);
//             throw error;
//         }
//     };

//     const register = async (name, email, password) => {
//         try {
//             console.log('1.1');
//             const { data } = await api.post('/register', { name, email, password });
//             console.log('2.1')
//             setUser(data);
//             return data;
//         } catch (error) {
//             console.error("Registration failed", error);
//             throw error;
//         }
//     }

//     const verifyOTP = async (email, otp) => {
//         try {
//             const { data } = await api.post('/auth/verifyOTP');
//             setUser(data);
//             localStorage.setItem("user", JSON.stringify(data));
//             return data;
//         } catch (error) {
//             console.error("OTP verification failed:", error);
//             throw error;
//         }
//     };

//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//     }

//     return (
//         <AuthContext.Provider value={{ user, loading, login, logout, verifyOTP, register }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };


// import React from "react";
// import api from "../utils/axios.js";

// export const AuthContext = React.createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = React.useState(null);
//     const [loading, setLoading] = React.useState(true);

//     React.useEffect(() => {
//         const storedUser = localStorage.getItem("user");

//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//         }

//         setLoading(false);
//     }, []);

//     const login = async (email, password) => {
//         try {
//             console.log("Login request");

//             const { data } = await api.post("/login", {
//                 email,
//                 password
//             });

//             console.log("Login response:", data);

//             setUser(data);

//             localStorage.setItem(
//                 "user",
//                 JSON.stringify(data)
//             );

//             localStorage.setItem(
//                 "token",
//                 data.token
//             );

//             return data;

//         } catch (error) {
//             console.error(
//                 "Login failed:",
//                 error.response?.data || error.message
//             );

//             throw error;
//         }
//     };


//     const register = async (name, email, password) => {
//         try {
//             console.log("Registration request");

//             const { data } = await api.post("/register", {
//                 name,
//                 email,
//                 password
//             });

//             console.log("Registration response:", data);

//             return data;

//         } catch (error) {
//             console.error(
//                 "Registration failed:",
//                 error.response?.data || error.message
//             );

//             throw error;
//         }
//     };


//     const verifyOTP = async (email, otp) => {
//         try {
//             console.log("OTP verification request");

//             const { data } = await api.post("/verifyOTP", {
//                 email,
//                 otp
//             });

//             console.log("OTP verification response:", data);

//             setUser(data);

//             localStorage.setItem(
//                 "user",
//                 JSON.stringify(data)
//             );

//             if (data.token) {
//                 localStorage.setItem(
//                     "token",
//                     data.token
//                 );
//             }

//             return data;

//         } catch (error) {
//             console.error(
//                 "OTP verification failed:",
//                 error.response?.data || error.message
//             );

//             throw error;
//         }
//     };


//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//     };


//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 loading,
//                 login,
//                 logout,
//                 verifyOTP,
//                 register
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };




import React from "react";
import api from "../utils/axios.js";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    // Restore the logged-in session
    React.useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            const token = localStorage.getItem("token");

            if (
                storedUser &&
                token &&
                token !== "undefined" &&
                token !== "null"
            ) {
                setUser(JSON.parse(storedUser));
            } else {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setUser(null);
            }
        } catch (error) {
            console.error("Session restoration failed:", error);

            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Login
    const login = async (email, password) => {
        try {
            const { data } = await api.post("/login", {
                email,
                password,
            });

            if (!data.token) {
                throw new Error(
                    "Login response did not contain an authentication token."
                );
            }

            setUser(data);

            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);

            return data;
        } catch (error) {
            console.error(
                "Login failed:",
                error.response?.data || error.message
            );

            throw error;
        }
    };

    // Register
    const register = async (name, email, password) => {
        try {
            const { data } = await api.post("/register", {
                name,
                email,
                password,
            });

            // Registration requires OTP verification.
            // Do not treat the user as logged in yet.
            return data;
        } catch (error) {
            console.error(
                "Registration failed:",
                error.response?.data || error.message
            );

            throw error;
        }
    };

    // Verify OTP
    const verifyOTP = async (email, otp) => {
        try {
            const { data } = await api.post("/verifyOTP", {
                email,
                otp,
            });

            if (!data.token) {
                throw new Error(
                    "OTP verification response did not contain an authentication token."
                );
            }

            setUser(data);

            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);

            return data;
        } catch (error) {
            console.error(
                "OTP verification failed:",
                error.response?.data || error.message
            );

            throw error;
        }
    };

    // Logout
    const logout = () => {
        setUser(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                verifyOTP,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};