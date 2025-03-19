import jwt from "jsonwebtoken";

export const protectedMiddleware = async (req, res, next) => {
    //get token from cookie
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
    if(!token){ 
        return res.json({success: false, message: "Not authorized"});
    }

    try {
        //decode token to get user Id
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user
    } catch (error) {
        return res.json({success: false, message: "Not authorized"});
    }
    next();
}