import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(403).json({ message: "Access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const isCreator = (req, res, next) => {
    if (!req.user || req.user.role !== "creator") {
        return res.status(403).json({ message: "Not authorized as a creator" });
    }
    next();
};
