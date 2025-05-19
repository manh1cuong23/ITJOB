import { FC, useEffect, useRef, useState, CSSProperties } from 'react';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  SettingOutlined,
  BellOutlined,
  MessageOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Layout, Dropdown, Divider, Tooltip } from 'antd';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MyButton } from '@/components/basic/button';
import { pageTitles } from '@/constants/page';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { ReactComponent as PlusSvg } from '@/assets/icons/ic_plus.svg';
import { ReactComponent as HeaderAvatar } from '@/assets/header/header_avatar.svg';
import { ReactComponent as HeaderArrowDown } from '@/assets/header/header_ArrowDown.svg';
import { ReactComponent as HeaderAccountSettings } from '@/assets/header/header_AccountSettings.svg';
import { ReactComponent as HeaderLogout } from '@/assets/header/header_Logout.svg';
import { ItemType } from 'antd/es/menu/interface';
import { setLastName } from '@/stores/slices/tags-view.slice';
import logo from '../../../assets/logo/logo.png';

import {
  setGeneralInfoData,
  setGuestSelected,
  setIndividualData,
} from '@/stores/slices/group-booking.slice';
import { Profile } from '@/components/business/modal/forgot-password';
import MenuList from '@/containers/menu/MenuList';
import { TypeUser } from '@/interface/common/type';
import ChatBox from './ChatBox';
import CustomMessagesDropdown from './CustomDropdown';

const { Header } = Layout;

interface HeaderProps {
  collapsed: boolean;
  toggle: () => void;
}

type Action = 'userInfo' | 'userSetting' | 'logout';

const HeaderComponent: FC<HeaderProps> = ({ collapsed, toggle }) => {
  const { lastName } = useSelector((state: any) => state.tagsView);
  const { role } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isMounted = useRef(true);
  const [isSettingHovered, setIsSettingHovered] = useState(false);
  const [isBellHovered, setIsBellHovered] = useState(false);
  const [isMessageHovered, setIsMessageHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMessageDropdownOpen, setIsMessageDropdownOpen] = useState(false);
  const [force, setForce] = useState(0);
  const [selectedChatId, setSelectedChatId] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  const { username } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(setLastName(''));
  }, [location.pathname, dispatch]);
  const getPageTitleFromUrl = (pathname: string): string => {
    const exactMatch = pageTitles.find(page => pathname === page.url);
    if (exactMatch) {
      return exactMatch.title;
    }

    for (const page of pageTitles) {
      if (page.regex && page.regex.test(pathname)) {
        const match = page.regex.exec(pathname);
        if (match) {
          return `${page.title}`;
        }
      }
    }

    return '';
  };
  const currentPage = getPageTitleFromUrl(location.pathname);

  const onActionClick = async (action: Action) => {
    switch (action) {
      case 'userInfo':
        return;
      case 'userSetting':
        setIsOpenProfile(true);
        return;
      case 'logout':
        localStorage.clear();
        window.location.href = '/login';
        return;
    }
  };

  const toLogin = () => {
    if (isMounted.current) {
      navigate(`/login?from=${encodeURIComponent(location.pathname)}`, {
        replace: true,
      });
    }
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const dropdownItems: ItemType[] = [
    {
      key: 'user-info',
      label: (
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.06)',
            padding: '0 10px',
            width: '252px',
          }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <HeaderAvatar
              style={{ width: '40px', height: '40px', margin: '5px 5px 0 0' }}
            />

            <div>
              <div style={{ color: 'black', fontWeight: 'bold' }}>
                {username || 'Nguyen Van A'}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'account-settings',
      label: (
        <div
          style={{
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
          }}>
          <HeaderAccountSettings style={{ marginRight: '10px' }} />
          Cài đặt tài khoản
        </div>
      ),
      onClick: () => onActionClick('userSetting'),
    },
    {
      type: 'divider',
      style: { margin: '0 10px' },
    },
    {
      key: 'profile',
      label: (
        <div
          style={{
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
          }}>
          <HeaderAccountSettings style={{ marginRight: '10px' }} />
          Xem thông tin cá nhân
        </div>
      ),
      onClick: () => {
        navigate('/profile');
      },
    },
    {
      key: 'logout',
      label: (
        <div
          style={{
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            color: '#EF4444',
          }}>
          <HeaderLogout style={{ marginRight: '10px' }} />
          Đăng xuất
        </div>
      ),
      onClick: () => onActionClick('logout'),
    },
  ];

  const handleDropdownVisibleChange = (visible: boolean) => {
    setIsDropdownOpen(visible);
  };

  const handleMessageDropdownVisibleChange = (visible: boolean) => {
    setIsMessageDropdownOpen(visible);
  };

  const handleSelectChat = (id: string) => {
    setSelectedChatId(id);
    setIsMessageDropdownOpen(false); // Đóng dropdown
  };

  const isButtonHighlighted = isDropdownOpen;

  const dropdownStyle: CSSProperties = {
    animationDuration: '0s',
    transition: 'none',
    boxShadow: '0px 12px 16px -8px rgba(0, 0, 0, 0.12)',
  };

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .ant-dropdown {
        animation-duration: 0s !important;
        transition: none !important;
        box-shadow: 0px 12px 16px -8px rgba(0, 0, 0, 0.12) !important;
      }
      .ant-slide-up-enter,
      .ant-slide-up-appear {
        animation-duration: 0s !important;
      }
      .ant-slide-up-leave {
        animation-duration: 0s !important;
      }
      .ant-btn.group-btn {
        margin-left: 0 !important;
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const headerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
  };

  const rightSectionStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  };

  return (
    <>
      <Header
        className="layout-page-header bg-2"
        style={headerStyle}
        data-theme="light">
        {role === TypeUser.User ? (
          <div className="flex gap-[10px] items-center">
            <NavLink to="/dashboard">
              <div className="">
                <img
                  className="h-[40px] object-contain"
                  src={logo}
                  alt="Logo"
                />
              </div>
            </NavLink>
            <div className="mx-4">
              <MenuList />
            </div>
          </div>
        ) : (
          <h3 style={{ fontSize: '18px', margin: 0 }}>
            {currentPage}
            {lastName !== '' ? ':' : ''}
          </h3>
        )}
        <div style={rightSectionStyle}>
          <SettingOutlined
            className="svg-icon"
            style={{
              fontSize: '18px',
              cursor: 'pointer',
              color: isSettingHovered ? '#EF4444' : undefined,
            }}
            onClick={() => navigate('/settings')}
            onMouseEnter={() => setIsSettingHovered(true)}
            onMouseLeave={() => setIsSettingHovered(false)}
          />
          <BellOutlined
            className="svg-icon"
            style={{
              fontSize: '18px',
              cursor: 'pointer',
              color: isBellHovered ? '#EF4444' : undefined,
            }}
            onClick={() => navigate('/notifications')}
            onMouseEnter={() => setIsBellHovered(true)}
            onMouseLeave={() => setIsBellHovered(false)}
          />
          <Dropdown
            overlay={
              <CustomMessagesDropdown
                role={role}
                open={isMessageDropdownOpen}
                force={force}
                onSelectChat={handleSelectChat}
              />
            }
            trigger={['click']}
            placement="bottom"
            onOpenChange={handleMessageDropdownVisibleChange}
            open={isMessageDropdownOpen}
            overlayStyle={{
              ...dropdownStyle,
              maxHeight: '400px',
              overflowY: 'hidden',
            }}>
            <MessageOutlined
              className="svg-icon"
              style={{
                fontSize: '18px',
                cursor: 'pointer',
                color: isMessageHovered ? '#EF4444' : undefined,
              }}
              onClick={() => {
                setIsMessageDropdownOpen(!isMessageDropdownOpen);
                setForce(prev => prev + 1);
              }}
              onMouseEnter={() => setIsMessageHovered(true)}
              onMouseLeave={() => setIsMessageHovered(false)}
            />
          </Dropdown>
          <div ref={dropdownRef}>
            <Dropdown
              menu={{ items: dropdownItems }}
              trigger={['hover', 'click']}
              onOpenChange={handleDropdownVisibleChange}
              open={isDropdownOpen}
              overlayStyle={dropdownStyle}>
              <MyButton
                buttonType="outline"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 8px 4px 2px',
                  height: '36px',
                  borderColor: isButtonHighlighted ? '#E3173C' : undefined,
                  backgroundColor: isButtonHighlighted ? '#FDECF0' : undefined,
                  gap: '8px',
                }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <HeaderAvatar className="w-[30px] h-[30px]" />
                <span style={{ color: '#000000' }}>
                  {(username || 'Nguyen Van A')
                    .split(' ')
                    .map(
                      word =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(' ')}
                </span>
                <HeaderArrowDown style={{ width: '12px', height: '12px' }} />
              </MyButton>
            </Dropdown>
          </div>
        </div>
        <Profile
          isOpen={isOpenProfile}
          onClose={() => setIsOpenProfile(false)}
          onSubmit={() => setIsOpenProfile(false)}
        />
      </Header>
      {selectedChatId && (
        <ChatBox
          chatId={selectedChatId}
          onClose={() => setSelectedChatId(null)}
        />
      )}
    </>
  );
};

export default HeaderComponent;
