import React from 'react';

// import { Container } from './styles';

interface IMessage {
  message: string;
  user: string;
  received: boolean;
}

interface Props {
  message: IMessage;
}

const Message: React.FC<Props> = ({ message }) => {
  return (
    <div className={message.received ? 'white' : 'green'}>
      <strong>{message.user}</strong>
      <span>{message.message}</span>
    </div>
  );
}

export default Message;