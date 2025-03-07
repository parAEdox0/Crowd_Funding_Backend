import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/userModel.js";

// Register User
export const registerUser = async (req, res) => {
    try {
        // Validate Request
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create New User
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT Token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Send Secure Response
        const safeUser = { id: newUser._id, name: newUser.name, email: newUser.email };
        res.status(201).json({ message: "User registered successfully!", token, user: safeUser });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        // Validate Request
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Validate Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Send Secure Response
        const safeUser = { id: user._id, name: user.name, email: user.email };
        res.json({ token, user: safeUser });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
