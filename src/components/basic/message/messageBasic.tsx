import React, { useState } from 'react';
import './messageStyle.less';
import { ReactComponent as TickSvg } from '@/assets/icons/ic_ticks.svg';
import { ReactComponent as WarmingSvg } from '@/assets/icons/ic_warming.svg';
import { ReactComponent as ErrorSvg } from '@/assets/icons/ic_error.svg';

type MessageType = 'success' | 'error' | 'warning';

interface IProps {
  type: MessageType;
  text: string;
}

const MessageBasic: React.FC<IProps> = ({ type, text }) => {
  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <TickSvg width={20} height={20} />;
      case 'error':
        return <ErrorSvg width={20} height={20} />;
      case 'warning':
        return <WarmingSvg width={20} height={20} />;
    }
  };
  return (
    <div className={`message-container ${type}`}>
      {renderIcon()}
      <span className="message-text">{text}</span>
    </div>
  );
};

export const useMessage = () => {
  const [message, setMessage] = useState<{
    type: MessageType;
    text: string;
  } | null>(null);

  const showMessage = (type: MessageType, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const MessageDisplay = () =>
    message && <MessageBasic type={message.type} text={message.text} />;

  return { showMessage, MessageDisplay };
};

export default MessageBasic;
