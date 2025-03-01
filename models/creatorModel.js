import mongoose from 'mongoose';

const creatorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    rewardsOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reward' }],
}, { timestamps: true });

export default mongoose.model('Creator', creatorSchema);
