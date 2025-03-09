import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) return res.status(401).json({ message: "No token, authorization denied" });

        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) return res.status(401).json({ message: "User not found" });

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};