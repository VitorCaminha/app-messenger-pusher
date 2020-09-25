import express from 'express';
import cors from 'cors';
import Pusher from 'pusher';
import mongoose from 'mongoose';

import Message from './schema/messages';

const pusher = new Pusher({
  appId: '1078874',
  key: '27df506d1257527f2d11',
  secret: '0386f9b924f7d24c691a',
  cluster: 'us2',
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
