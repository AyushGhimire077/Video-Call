import express from "express";
import { registerUser, fetchUsers, loginUser, checkUser } from "../controllers/authController.js";
import { protectedMiddleware } from "../middleware/protectedMiddleware.js";


const AuthRouter = express.Router();


// Register route
AuthRouter.post("/register", registerUser); 

// Login route
AuthRouter.post("/login", loginUser); 

// Fetch all users route
AuthRouter.get("/users", protectedMiddleware, fetchUsers); 

// Check user route
AuthRouter.get("/check", protectedMiddleware, checkUser); 



export default AuthRouter;