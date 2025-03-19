import AuthModel from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Regsitering user
export const registerUser = async (req, res) => {
    //get info from request body
    const { userName, password } = req.body;
    if(!userName || !password){
        return res.status(400).json({success: false, message: "Please provide userName and password"});
    }

    try {
        //check if userName already exists
        const existingUser = await AuthModel.findOne({ userName });
        //if user already exits return
        if(existingUser){ 
            return res.json({success: false, message: "User already exists"});
        }

        //hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        //creating new user
        const newUser = new AuthModel({ userName, password: hashedPassword });

        //saving new user
        await newUser.save();

        //creating jwt token 
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "2d" }); //token expires in 2 days

        //sending token as cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: "lax",
          maxAge: 2 * 24 * 60 * 60 * 1000, //2 days
        });

        //returning response
        return res.status(201).json({success: true, message: "User registered successfully"});

    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }

}

//Login user
export const loginUser = async (req, res) => {
    //get info from request body
    const { userName, password } = req.body;
    if(!userName || !password){ 
        return res.status(400).json({success: false, message: "Please provide userName and password"});
    }

    try {
        //check if user exists
        const user = await AuthModel.findOne({ userName });
        if(!user){ 
            return res.status(404).json({success: false, message: "User not found"});
        }

        //check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){ 
            return res.status(401).json({success: false, message: "Invalid credentials"});
        }

        //creating jwt token 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" }); //token expires in 2 days

        //sending token as cookie
        res.cookie("token", token, {
          httpOnly: true,   
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: "lax",
          maxAge: 2 * 24 * 60 * 60 * 1000, //2 days
        });

        //returning response
        return res.status(200).json({success: true, message: "User logged in successfully"});

    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }

}

//Check logged and pass user
export const checkUser = async (req, res) => {
    //get token from cookie
    const user = req.user;
    if(!user){ 
        return res.json({ success: false, message: "Not authorized" });
    }

    try {
        
        const User = await AuthModel.findById(user.id).select("-password");
        if(!User){ 
            return res.json({success: false, message: "User not found"});
        }


        //returning response
        return res.json({success: true, message: "User is logged in", user: User});

    } catch (error) {
        console.error(error);
        return res.json({success: false, message: "Not authorized"});
    }
}


//Fetch all users
export const fetchUsers = async (req, res) => {
    const user = req.user;
    if(!user){ 
        return res.status(401).json({success: false, message: "Not authorized haha"});
    }
    try {
        //fetching all users
        const users = await AuthModel.find({ _id: { $ne: user.id } }).select("-password");
        //returning response    
        return res.status(200).json({success: true, message: "Users fetched successfully", users});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Internal server error"});
    }
}