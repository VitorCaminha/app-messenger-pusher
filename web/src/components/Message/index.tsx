import React from 'react';

import './styles.css';

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
    <div id="message" className={message.received ? 'white' : 'red'}>
      <strong className={message.received ? 'whiteText' : 'redText'}>{message.user}</strong>
      <span className={message.received ? 'whiteText' : 'redText'}>{message.message}</span>
    </div>
  );
}

export default Message;