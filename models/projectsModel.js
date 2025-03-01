import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    goal: { type: Number, required: true },
    duration: { type: Number, required: true },
    completionPercentage: { type: Number, default: 0 },
    image: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Ensure this exists
});

export default mongoose.model("Project", projectSchema);
