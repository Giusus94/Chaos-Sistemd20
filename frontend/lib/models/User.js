// User Model

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String, default: '' },
  avatar: { type: String, default: '' },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
