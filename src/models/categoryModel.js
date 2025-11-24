import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
