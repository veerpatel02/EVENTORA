// import jwt from "jsonwebtoken"
// import User from "../models/auth.model.js";

// //User Authentication Middleware
// const protect = async (req, res, next) => {
//     console.log("1")
//     const token = req.headers.authorization && req.headers.authorization.startsWith('bearer') ? req.headers.authorization.split('')[1] : null;
//     console.log(token)
//     if (token) {
//         try {
//             console.log("2")
//             const decode = jwt.verify(token, process.env.JWT_SECRET);
//             console.log(decode)
//             req.user = await User.findById(decode.id).select('-password');
//             if (!req.user) {
//                 return res.status(401).json({ message: 'Not authorized, user not found' })
//             }
//             next();
//         } catch (error) {
//             return res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     }
//     else {
//         res.status(401).json({ message: 'Not authorized, no token' });
//     }
// };

// const admin = (req, res, next) => {
//     if (req.user && req.user.role === 'admin') {
//         next();
//     }
//     else {
//         return res.status(403).json({ message: 'Forbidden, admin access required' });
//     }
// };

// export { protect, admin };


import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";

// User Authentication Middleware
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
        return res.status(401).json({
            message: "Not authorized, no token",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "Not authorized, user not found",
            });
        }

        req.user = user;
        return next();
    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Not authorized, token failed",
        });
    }
};

// Admin Authorization Middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }

    return res.status(403).json({
        message: "Forbidden, admin access required",
    });
};

export { protect, admin };