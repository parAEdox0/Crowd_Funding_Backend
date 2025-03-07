import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    projectsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    backedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
