import {
  getListConversation,
  getListEmployer,
  makeConversation,
} from '@/api/features/chat';
import { getListCandicate } from '@/api/features/recruite';
import { getMe } from '@/api/features/user';
import { TypeUser } from '@/interface/common/type';
import { formatDateNew } from '@/utils/formatDate';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { FC, useEffect, useRef, useState } from 'react';

// Giả lập dữ liệu chat

const CustomMessagesDropdown: FC<{
  onSelectChat: (id: string) => void;
  role: any;
  force: any;
  open?: boolean;
}> = ({ onSelectChat, open, force, role }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);
  const [employers, setEmployer] = useState([]);
  const [candicates, setCandicates] = useState([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetConversation = async () => {
    const res = await getListConversation([]);
    if (res?.conversations) {
      setConversations(res?.conversations);
    }
  };
  const handleChangeSearch = (e: any) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (role === TypeUser.User) {
        fetchEmployer({ name: value });
      } else {
        fetchCandicate({ name: value });
      }
    }, 300);
  };
  const handleMakeConversation = async (id: string) => {
    const dataMe = await getMe();
    if (role == TypeUser.User) {
      const res = await makeConversation({
        employer_id: id,
        candidate_id: dataMe?.result?._id,
      });
      onSelectChat && onSelectChat(res?.result?._id);
    } else if (role == TypeUser.Employer) {
      const res = await makeConversation({
        candidate_id: id,
        employer_id: dataMe?.result?._id,
      });
      onSelectChat && onSelectChat(res?.result?._id);
    }
  };
  const fetchEmployer = async (data: any = []) => {
    const res = await getListEmployer(data);
    if (res?.result) {
      setEmployer(res?.result);
    }
  };
  const fetchCandicate = async (data: any = []) => {
    const res = await getListCandicate(data);
    if (res?.result) {
      setCandicates(res?.result);
    }
  };
  useEffect(() => {
    setIsInputFocused(false);
    if (open) {
      if (role == TypeUser.User) {
        fetchEmployer();
      }
      if (role == TypeUser.Employer) {
        fetchCandicate();
      }
      fetConversation();
    }
  }, [open, force]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0px 12px 16px -8px rgba(0, 0, 0, 0.12)',
        width: '320px',
        maxHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <div style={{ flexShrink: 0 }}>
        <div
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderBottom: '1px solid #f0f0f0',
          }}>
          Đoạn chat
        </div>
        <div className="py-[6px] px-[16px] flex items-center gap-[16px]">
          {isInputFocused && (
            <ArrowLeftOutlined
              onClick={() => setIsInputFocused(false)}
              className="cursor-pointer"
            />
          )}
          <input
            type="text"
            placeholder={
              role == TypeUser.User
                ? 'Tìm kiếm nhà tuyển dụng ...'
                : 'Tìm kiếm ứng viên ...'
            }
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
            }}
            onFocus={() => setIsInputFocused(true)}
            value={searchQuery}
            onChange={handleChangeSearch}
          />
        </div>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: 'calc(400px - 96px)',
        }}>
        {!isInputFocused &&
          (conversations.length ? (
            conversations.map((conversation: any) => (
              <div
                key={conversation?.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onClick={() => onSelectChat(conversation?._id)}
                onMouseEnter={e =>
                  (e.currentTarget.style.backgroundColor = '#f5f5f5')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.backgroundColor = '#fff')
                }>
                <img
                  src={
                    role === TypeUser.Employer
                      ? conversation?.candidate_info?.avatar &&
                        conversation.candidate_info.avatar !== ''
                        ? conversation.candidate_info.avatar
                        : 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'
                      : conversation?.employer_info?.avatar &&
                        conversation.employer_info.avatar !== ''
                      ? conversation.employer_info.avatar
                      : 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'
                  }
                  alt={conversation?.employer_info?.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    marginRight: '12px',
                    objectFit: 'cover',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {role == TypeUser.Employer
                      ? conversation?.candidate_info?.name
                      : conversation?.employer_info?.name}
                  </div>
                  <div
                    style={{
                      color: '#595959',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                    {conversation?.last_message_info?.message}
                  </div>
                </div>
                <div
                  style={{
                    color: '#8c8c8c',
                    fontSize: '12px',
                    textAlign: 'right',
                  }}>
                  {formatDateNew(conversation?.last_message_info?.created_at)}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                color: '#8c8c8c',
              }}>
              Không có tin nhắn
            </div>
          ))}
        {isInputFocused &&
          role == TypeUser.User &&
          (employers.length > 0 ? (
            employers.map((employer: any) => (
              <div
                key={employer?.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onClick={() =>
                  handleMakeConversation(employer?.account_info?._id)
                }
                onMouseEnter={e =>
                  (e.currentTarget.style.backgroundColor = '#f5f5f5')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.backgroundColor = '#fff')
                }>
                <img
                  src={
                    employer?.avatar != ''
                      ? employer?.avatar
                      : 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'
                  }
                  alt={employer?.name}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    marginRight: '12px',
                    objectFit: 'cover',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {employer?.name}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                color: '#8c8c8c',
              }}>
              Không có dữ liệu
            </div>
          ))}
        {isInputFocused &&
          role == TypeUser.Employer &&
          (candicates.length > 0 ? (
            candicates.map((candicate: any) => {
              return (
                <div
                  key={candicate?.candidate_info?.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onClick={() => handleMakeConversation(candicate?._id)}
                  onMouseEnter={e =>
                    (e.currentTarget.style.backgroundColor = '#f5f5f5')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.backgroundColor = '#fff')
                  }>
                  <img
                    src={
                      candicate?.candidate_info?.avatar != ''
                        ? candicate?.candidate_info?.avatar
                        : 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740'
                    }
                    alt={candicate?.candidate_info?.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      marginRight: '12px',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {candicate?.candidate_info?.name}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                color: '#8c8c8c',
              }}>
              Không có dữ liệu
            </div>
          ))}
      </div>
    </div>
  );
};
export default CustomMessagesDropdown;
