import express from 'express';
import cors from 'cors';
import Pusher from 'pusher';
import mongoose from 'mongoose';

import Message from './schema/messages';

const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(cors());
app.use(express.json());

app.get('/pusher-status', (req, res) => {
  const response = pusher.trigger('messager', 'newMessage', {
    'message': 'hello world'
  });

  console.log(response);
});

app.get('/messages', async (req, res) => {
  const messages = await Message.find();

  return res.json(messages);
});

app.post('/messages', (req, res) => {
  const { id, user, message } = req.body;

  const newMessage = new Message({ id, user, message });

  newMessage.save();

  pusher.trigger('messager', 'newMessage', {
    'message': newMessage
  });

  return res.json(newMessage);
})


export default app;
