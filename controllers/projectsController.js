import Project from "../models/projectsModel.js";
import Contribution from "../models/contributionModel.js";

// Create a new project
export const createProject = async (req, res) => {
    try {
        const { title, description, goal, duration, category, image } = req.body;
        console.log("Request body:", req.body);
        console.log("User:", req.user);

        if (!title || !description || !goal || !duration || !category) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }

        const project = new Project({
            title,
            description,
            goal: parseInt(goal),
            duration: parseInt(duration),
            category,
            image,
            creator: req.user._id,
            raised: 0,
            daysLeft: parseInt(duration),
        });

        const savedProject = await project.save();
        console.log("Saved project:", savedProject);
        res.status(201).json({ message: "Project created successfully", project: savedProject });
    } catch (error) {
        console.error("Create project error:", error.stack);
        res.status(500).json({ error: error.message });
    }
};

// Get all projects
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("creator", "name email");
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single project by ID
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate("creator", "name email");
        if (!project) return res.status(404).json({ error: "Project not found" });

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a project (Only by the Creator)
export const updateProject = async (req, res) => {
    try {
        const { title, description, goal, duration } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });

        if (project.creator.toString() !== req.user.id) {
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
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });

        if (project.creator.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized: Only the creator can delete this project" });
        }

        await project.deleteOne();
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Contribute to a project (User invests money)
export const contributeToProject = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: "Amount must be greater than zero" });
        }

        const projectId = req.params.id;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ error: "Project not found" });

        if (project.fundsRaised + amount > project.goal) {
            return res.status(400).json({ error: "Contribution exceeds project goal" });
        }

        const contribution = new Contribution({ backer: req.user.id, project: projectId, amount });
        await contribution.save();

        project.fundsRaised += amount;
        project.completionPercentage = (project.fundsRaised / project.goal) * 100;
        await project.save();

        res.status(200).json({ message: "Contribution successful", project, contribution });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
