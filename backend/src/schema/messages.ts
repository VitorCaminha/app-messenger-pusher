import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: String,
  message: String,
  user: String,
});

export default mongoose.model('Message', messageSchema)