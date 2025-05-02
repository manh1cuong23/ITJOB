import { getChat, getConvDetail, sendChat } from '@/api/features/chat';
import { getMe } from '@/api/features/user';
import { useSocket } from '@/api/socket/SocketContext';
import { TypeUser } from '@/interface/common/type';
import { formatDateNew, formatDateTime } from '@/utils/formatDate';
import { CloseOutlined } from '@ant-design/icons';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const ChatBox: FC<{
  chatId: string;
  onClose: () => void;
}> = ({ chatId, onClose }: any) => {
  const [message, setMessage] = useState('');
  const [data, setData] = useState<any>([]);
  const [dataMe, setDataMe] = useState<any>([]);
  const [pagination, setPagination] = useState<any>([]);
  const [page, setPage] = useState<any>(1);
  const [limit, setLimit] = useState<any>(10);
  const [employerData, setEmployerData] = useState<any>([]);
  const [candicateData, setCandicateData] = useState<any>([]);
  const [messages, setMessages] = useState<any>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { role } = useSelector((state: any) => state.auth);
  const { socket } = useSocket();

  const fetchConvDetail = async (id: string) => {
    const res = await getConvDetail(id);
    if (res?.conversations) {
      setEmployerData(res?.conversations[0]?.employer_info);
      setCandicateData(res?.conversations[0]?.candidate_info);
    }
  };
  const fetchChat = async (newPage = 1) => {
    const res = await getChat(chatId, { page: newPage, limit: limit });
    if (res?.result) {
      const newMessages = res.result.result.reverse();
      setData((prev: any) => [...newMessages, ...prev]); // thêm vào đầu
      setPagination(res?.result?.pagination);
    }
  };
  const fetchMe = async () => {
    const dataMe = await getMe();
    if (dataMe?.result) {
      setDataMe(dataMe?.result);
    }
  };
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0) {
        const prevScrollHeight = container.scrollHeight;
        if (page < pagination?.total_pages) {
          setPage((prev: any) => prev + 1);

          // Delay để đảm bảo dữ liệu đã render rồi mới scroll
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight / 6; // cuộn xuống 1/3
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [pagination]);
  useEffect(() => {
    fetchMe();
    setData([]);
    setPage(1);
    if (chatId) {
      fetchConvDetail(chatId);
    }
  }, [chatId]);
  useEffect(() => {
    if (chatId) {
      fetchChat(page);
    }
  }, [page, chatId]);
  const handleSend = async () => {
    if (message.trim()) {
      const res = await sendChat({ conversatin_id: chatId, content: message });
      if (res?.message == 'Send message suscess') {
        setMessage('');
      }
      socket?.emit('newChat', chatId, {
        message: message,
        sender_id: dataMe?._id,
        created_at: new Date(),
      });
    }
  };

  useEffect(() => {
    socket?.emit('joinChat', chatId);

    socket?.on('chatUpdated', data => {
      setData((prev: any) => [...prev, data]);
    });

    return () => {
      socket?.off('chatUpdated');
    };
  }, [socket, chatId]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' }); // hoặc 'smooth'
    }
  };

  useEffect(() => {
    if (page == 1) {
      scrollToBottom(); // chạy mỗi khi có thay đổi data
    }
  }, [data]);
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '0',
        right: '20px',
        width: '300px',
        height: '400px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
      }}>
      {/* Tiêu đề hộp thoại */}
      <div
        style={{
          padding: '12px 16px',
          backgroundColor: '#F07087',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={
              data?.avatar ||
              'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='
            }
            alt={data?.[0]?.employer_info?.name}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              marginRight: '8px',
            }}
          />
          <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {role == TypeUser.User ? employerData?.name : candicateData?.name}
          </span>
        </div>
        <CloseOutlined
          style={{ cursor: 'pointer', color: '#fff', fontSize: '16px' }}
          onClick={onClose}
        />
      </div>
      {/* Nội dung tin nhắn */}
      <div
        ref={scrollContainerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          backgroundColor: '#fafafa',
        }}>
        {data.map((msg: any, index: number) => {
          return (
            <div
              key={index}
              style={{
                marginBottom: '8px',
                textAlign:
                  // msg?.candidate_info?.length > 0 === (role == TypeUser.User)
                  msg?.sender_id == dataMe?._id ? 'right' : 'left',
              }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  backgroundColor:
                    msg?.sender_id == dataMe?._id ? '#0084ff' : '#e4e6eb',
                  color: msg?.sender_id == dataMe?._id ? '#fff' : '#000',
                  maxWidth: '70%',
                  fontSize: '14px',
                }}>
                {msg?.message}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#8c8c8c',
                  marginTop: '4px',
                }}>
                {formatDateTime(msg?.created_at)}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      {/* Ô nhập tin nhắn */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
        }}>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #F07087',
            borderRadius: '4px',
            fontSize: '14px',
            marginRight: '8px',
            outline: 'none',
          }}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          style={{
            padding: '8px 12px',
            backgroundColor: '#F07087',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
          Gửi
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
