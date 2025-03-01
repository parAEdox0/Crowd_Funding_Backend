import Project from "../models/projectsModel.js";

// Create a new project
export const createProject = async (req, res) => {
    try {
        const { title, description, creator, goal, duration } = req.body;
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
        res.status(201).json(project);
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

// Update a project
export const updateProject = async (req, res) => {
    try {
        const { title, description, goal, duration } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });

        project.title = title || project.title;
        project.description = description || project.description;
        project.image = image || project.image;
        project.goal = goal || project.goal;
        project.duration = duration || project.duration;

        await project.save();
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a project
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });

        await project.deleteOne();
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Contribute to a project (Backer invests money)
import Contribution from "../models/contributionModel.js";

export const contributeToProject = async (req, res) => {
    try {
        const { backerId, amount } = req.body;
        const projectId = req.params.id;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ error: "Project not found" });

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
