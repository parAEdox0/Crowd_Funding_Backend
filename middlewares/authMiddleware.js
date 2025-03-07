import jwt from "jsonwebtoken";

// Middleware to protect routes (authentication)
export const protect = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided or invalid format" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Middleware to check if user is a creator
export const isCreator = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user data" });
    }

    if (req.user.role !== "creator") {
        return res.status(403).json({ message: "Forbidden: Not authorized as a creator" });
    }

    next();
};
