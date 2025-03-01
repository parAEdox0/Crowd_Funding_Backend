import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import Creator from '../models/creatorModel.js';
import Backer from '../models/backerModel.js';

// Register a Creator
export const registerCreator = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newCreator = new Creator({ name, email, password: hashedPassword });
        await newCreator.save();

        res.status(201).json({ message: "Creator registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Register a Backer
export const registerBacker = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newBacker = new Backer({ name, email, password: hashedPassword });
        await newBacker.save();

        res.status(201).json({ message: "Backer registered successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login for Creators & Backers
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body; // role: "creator" or "backer"
        const UserModel = role === "creator" ? Creator : Backer;

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
