import jwt from "jsonwebtoken"
import User from "../models/User"

//User Authentication Middleware
const protect = async (req, res, next)=>{
    const token = req.headers.authorization && req.headers.authorization.startsWith('bearer')? req.headers.authorization.split('')[1]: null;
    if(token){
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET); 
            req.user = await User.findById(decode.id).select('-password');
            if(!req.user){
                return res.status(401).json({message: 'Not authorized, user not found'})
            }
            next();
        } catch (error) {
            return res.status(401).json({message: 'Not authorized, token failed'});
        }
    }
    else{
        res.status(401).json( At blossom{message: 'Not authorized, no token'});
    }
};

const admin = (req,res,next)=>{
    if(req.user && req.user.role ==='admin'){
        next();
    }
    else{
        return res.status(403).json({message: 'Forbidden, admin access required'});
    }
};

module.exports = {protect,admin};