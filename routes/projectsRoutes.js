import express from "express";
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    contributeToProject,
} from "../controllers/projectsController.js";
import { protect, isCreator } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", protect, isCreator, createProject);
router.put("/:id", protect, isCreator, updateProject);
router.delete("/:id", protect, isCreator, deleteProject);
router.post("/:id/contribute", protect, contributeToProject);

export default router;
