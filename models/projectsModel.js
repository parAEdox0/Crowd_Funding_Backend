import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    goal: { type: Number, required: true },
    duration: { type: Number, required: true },
    category: { type: String, required: true },
    raised: { type: Number, default: 0 },
    completionPercentage: { type: Number, default: 0 },
    daysLeft: { type: Number, required: true },
    image: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
});

projectSchema.pre("save", function (next) {
    if (this.isNew) {
        this.daysLeft = this.duration;
    } else {
        const now = new Date();
        const created = new Date(this.createdAt);
        const diffTime = now - created;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        this.daysLeft = Math.max(0, this.duration - diffDays);
    }
    this.completionPercentage = this.goal > 0 ? (this.raised / this.goal) * 100 : 0;
    next();
});

export default mongoose.model("Project", projectSchema);