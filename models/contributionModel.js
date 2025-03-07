import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema({
    backer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

export default mongoose.model("Contribution", contributionSchema);
