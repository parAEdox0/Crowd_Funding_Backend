import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    backers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Backer' }],
}, { timestamps: true });

export default mongoose.model('Reward', rewardSchema);
