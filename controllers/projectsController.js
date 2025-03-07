import Project from "../models/projectsModel.js";
import Contribution from "../models/contributionModel.js";
import { validationResult } from "express-validator";

// Create a new project
export const createProject = async (req, res) => {
    try {
        const { title, description, creator, goal, duration } = req.body;
        if (!title || !description || !creator || !goal || !duration) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(duration));

        const project = new Project({
            title,
            description,
            creator,
            image,
            goal,
            duration,
            endDate,
            completionPercentage: 0,
            fundsRaised: 0,
        });

        await project.save();
        res.status(201).json({ message: "Project created successfully", project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all projects
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("creator rewards backers");
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single project by ID
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate("creator rewards backers");
        if (!project) return res.status(404).json({ error: "Project not found" });

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a project (Only by the Creator)
export const updateProject = async (req, res) => {
    try {
        const { title, description, goal, duration, creator } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });

        // Ensure only the creator can update the project
        if (project.creator.toString() !== creator) {
            return res.status(403).json({ error: "Unauthorized: Only the creator can update this project" });
        }

        project.title = title || project.title;
        project.description = description || project.description;
        project.image = image || project.image;
        project.goal = goal || project.goal;
        project.duration = duration || project.duration;

        await project.save();
        res.status(200).json({ message: "Project updated successfully", project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a project (Only by the Creator)
export const deleteProject = async (req, res) => {
    try {
        const { creator } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });

        // Ensure only the creator can delete the project
        if (project.creator.toString() !== creator) {
            return res.status(403).json({ error: "Unauthorized: Only the creator can delete this project" });
        }

        await project.deleteOne();
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Contribute to a project (Backer invests money)
export const contributeToProject = async (req, res) => {
    try {
        const { backerId, amount } = req.body;
        if (!backerId || !amount) {
            return res.status(400).json({ error: "Backer ID and amount are required" });
        }

        const projectId = req.params.id;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ error: "Project not found" });

        // Ensure total funds do not exceed the goal
        if (project.fundsRaised + amount > project.goal) {
            return res.status(400).json({ error: "Contribution exceeds project goal" });
        }

        // Create a contribution entry
        const contribution = new Contribution({ backer: backerId, project: projectId, amount });
        await contribution.save();

        // Update project funding details
        project.fundsRaised += amount;
        project.completionPercentage = (project.fundsRaised / project.goal) * 100;
        await project.save();

        res.status(200).json({ message: "Contribution successful", project, contribution });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
