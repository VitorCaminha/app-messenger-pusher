import React, { FormEvent, useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { v4 as uuid } from 'uuid';

import api from './services/api';

import Message from './components/Message';
import './App.css';

interface IMessage {
  id: string;
  message: string;
  user: string;
  received: boolean;
}

interface IData {
  message: IMessage;
}

const pusher = new Pusher('27df506d1257527f2d11', {
  cluster: 'us2'
});

function App() {
  const [id, setId] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [user, setUser] = useState<string>('');
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    let oldId = localStorage.getItem('id');

    if (!oldId) {
      oldId = uuid();
    }

    setId(oldId);
  }, [])
  
  useEffect(() => {
    api.get('/messages').then((res) => {
      const allMessages = res.data.map((message: IMessage) => {
        if (message.id === id) {
          return {
            ...message,
            received: false,
          }
        } else {
          return {
            ...message,
            received: true,
          }
        }
      })

      setMessages(allMessages);
    });
  }, [id])

  useEffect(() => {
    const channel = pusher.subscribe('messager');
    channel.bind('newMessage', (data: IData) => {
      if (id !== data.message.id) {
        setMessages([...messages, data.message])
      }
    });

    return () => {
      channel.unbind('newMessage');
      channel.unsubscribe();
    }
  }, [id, messages])

  async function handleSend(e: FormEvent) {
    e.preventDefault();

    const res =await api.post('/messages', {
      id,
      message: newMessage,
      user,
    });

    setMessages([ ...messages, res.data ])
    setNewMessage('')
  }

  return (
    <>
      <h1>Pusher Messenger</h1>
      <div id="name">
        <h2>Seu Nome:</h2>
        <input
          id="nameInput"
          type="text"
          placeholder="Coloque seu nome aqui"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
      </div>

      <div id="conversation">
        <h2>Conversa</h2>
        <section>
          {messages.map(message => <Message message={message} key={message.id} />)}
        </section>
      </div>
      <form onSubmit={handleSend}>
        <textarea
          id="messageInput"
          placeholder="Digite sua mensagem"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </>
  );
}

export default App;
