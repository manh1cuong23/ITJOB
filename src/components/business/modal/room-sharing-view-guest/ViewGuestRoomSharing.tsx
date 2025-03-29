import React, { useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as Tick } from '@/assets/icons/ic_ticks.svg';
import { ReactComponent as Edit } from '@/assets/icons/ic_edit_white.svg';
import { ReactComponent as Upload } from '@/assets/icons/ic_upload.svg';
import { ReactComponent as BackSvg } from '@/assets/icons/ic_back.svg';
import { ReactComponent as Save } from '@/assets/icons/ic_save.svg';
import { MyCardContent } from '@/components/basic/card-content';
import { ReactComponent as MoonSvg } from '@/assets/icons/ic_moon.svg';
import { ReactComponent as Calendar } from '@/assets/icons/ic_calendar_black.svg';
import { ReactComponent as ArrowRight } from '@/assets/icons/ic_arrow_right.svg';

import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, message, Image, Tooltip } from 'antd';

import { MyModal } from '@/components/basic/modal';

import { getGuestInfo } from '@/api/features/guestInfo';
import dayjs from 'dayjs';
import MyCardContentMulti from '@/components/basic/card-content/CardContentMulti';
import { css } from '@emotion/react';
import GuestInfoCRU from '../guest-info-cru/GuestInfoCRU';
import { useSelector } from 'react-redux';
import { selectIdType } from '@/stores/slices/idType.slice';

interface TruncatedTextProps {
  text: string;
  maxWidth?: number;
}

const titleStyle = {
  color: '#57534E',
  fontSize: '13px',
  fontWeight: 400,
};
const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxWidth = 150,
}) => {
  return (
    <Tooltip title={text}>
      <div
        style={{
          maxWidth: maxWidth,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
        {text}
      </div>
    </Tooltip>
  );
};

const ViewGuestRoomSharing: React.FC<{
  setNamePhone?: any;
  justGuestInfo?: boolean;
  guestSelected: any;
  visible: boolean;
  setGuestSelected?: (data: any) => void;
  setPageData?: (data: any) => void;
  onCancel: () => void;
  title: string;
}> = ({
  setNamePhone,
  justGuestInfo,
  guestSelected,
  visible,
  onCancel,
  title,
  setPageData,
  setGuestSelected,
}) => {
  const [isVisible, setVisible] = useState(visible);
  useEffect(() => {
    setVisible(visible);
  }, [visible]);
  useEffect(() => {
    console.log('guestSelected', guestSelected);
  }, [guestSelected]);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const idType = useSelector(selectIdType);
  const documents = guestSelected?.documents
    ? JSON.parse(guestSelected?.documents)
    : [];

  return (
    <div>
      <MyModal
        width={500}
        title={title}
        open={isVisible}
        onCancel={onCancel}
        footer={
          <>
            <MyButton onClick={onCancel} buttonType="outline">
              Close
            </MyButton>
            <MyButton
              onClick={() => {
                setModalEditVisible(true);
                setTimeout(() => {
                  setVisible(false);
                }, 100);
              }}
              // icon={<Edit />}
            >
              Edit
            </MyButton>
          </>
        }>
        {guestSelected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <MyCardContentMulti
              items={[
                {
                  title: <span style={titleStyle}>Guest name</span>,
                  content: (
                    <TruncatedText
                      text={guestSelected.fullName || '_'}
                      maxWidth={150}
                    />
                  ),
                },
                {
                  title: <span style={titleStyle}>Gender</span>,
                  content: (
                    <>
                      {guestSelected.gender === 'M'
                        ? 'Male'
                        : guestSelected.gender === 'F'
                        ? 'Female'
                        : guestSelected.gender === 'O'
                        ? 'Other'
                        : '_'}
                    </>
                  ),
                },
                {
                  title: <span style={titleStyle}>Birthday</span>,
                  content: (
                    <>
                      {guestSelected.birthdate
                        ? dayjs(guestSelected.birthdate).format('DD/MM/YYYY')
                        : '_'}
                    </>
                  ),
                },
              ]}
            />
            <MyCardContentMulti
              items={[
                {
                  title: <span style={titleStyle}>Phone</span>,
                  content: (
                    <>{guestSelected.phone ? guestSelected.phone : '_'}</>
                  ),
                },
                {
                  title: <span style={titleStyle}>Email</span>,
                  content: (
                    <TruncatedText
                      text={guestSelected.email || '_'}
                      maxWidth={200}
                    />
                  ),
                },
              ]}
            />
            <MyCardContent
              title={<span style={titleStyle}>Address information</span>}>
              <>{guestSelected.fullAddress ? guestSelected.fullAddress : '_'}</>
            </MyCardContent>

            <MyCardContentMulti
              items={[
                {
                  title: <span style={titleStyle}>ID Type</span>,
                  content: (
                    <>
                      {guestSelected.idType
                        ? idType.find(
                            item => item.value === guestSelected.idType
                          )?.label || '_'
                        : '_'}
                    </>
                  ),
                },
                {
                  title: <span style={titleStyle}>ID NO</span>,
                  content: <>{guestSelected.idNo ? guestSelected.idNo : '_'}</>,
                },
              ]}
            />
            <MyCardContentMulti
              items={[
                {
                  title: <span style={titleStyle}>Issue place</span>,
                  content: (
                    <>{guestSelected.idIssuer ? guestSelected.idIssuer : '_'}</>
                  ),
                },
                {
                  title: <span style={titleStyle}>Issue date</span>,
                  content: (
                    <>
                      {guestSelected.idDate
                        ? dayjs(guestSelected.idDate).format('DD/MM/YYYY')
                        : '_'}
                    </>
                  ),
                },
                {
                  title: <span style={titleStyle}>Expire date</span>,
                  content: (
                    <>
                      {guestSelected.idExpiryDate
                        ? dayjs(guestSelected.idExpiryDate).format('DD/MM/YYYY')
                        : '_'}
                    </>
                  ),
                },
              ]}
            />
            <MyCardContent title={<span style={titleStyle}>ID Image</span>}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                <div style={{ width: '50%' }}>
                  {documents && documents[0]?.file_url && (
                    <Image
                      style={{ borderRadius: '8px' }}
                      src={`${import.meta.env.VITE_BASE_IMG_URL}${
                        documents[0]?.file_url
                      }`}
                    />
                  )}
                </div>
                <div style={{ width: '50%' }}>
                  {documents && documents[1]?.file_url && (
                    <Image
                      style={{ borderRadius: '8px' }}
                      src={`${import.meta.env.VITE_BASE_IMG_URL}${
                        documents[1]?.file_url
                      }`}
                    />
                  )}
                </div>
              </div>
            </MyCardContent>
            <MyCardContent title={<span style={titleStyle}>Remark</span>}>
              <div>{guestSelected.remark ? guestSelected.remark : '_'}</div>
            </MyCardContent>
          </div>
        ) : (
          <></>
        )}
      </MyModal>
      {guestSelected && (
        <GuestInfoCRU
          setOpen={setModalEditVisible}
          setGuestSelected={setGuestSelected}
          id={guestSelected.id}
          setPageData={setPageData}
          setNamePhone={setNamePhone}
          title={'Edit Guest Info'}
          open={modalEditVisible}
          sourcePopup="main"
          onFinish={() => {
            setModalEditVisible(false);
            setTimeout(() => {
              setVisible(true);
            }, 100);
          }}
          onCancel={() => {
            setModalEditVisible(false);
            setTimeout(() => {
              setVisible(true);
            }, 100);
          }}
          onBack={() => {
            setModalEditVisible(false);
            setTimeout(() => {
              setVisible(true);
            }, 100);
          }}
        />
      )}
    </div>
  );
};

export default ViewGuestRoomSharing;
