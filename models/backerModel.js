import mongoose from 'mongoose';

const backerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    backedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    rewardsClaimed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reward' }],
}, { timestamps: true });

export default mongoose.model('Backer', backerSchema);
