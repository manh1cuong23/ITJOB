import React, { useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as Edit } from '@/assets/icons/ic_edit_white.svg';
import { MyCardContent } from '@/components/basic/card-content';
import { ReactComponent as MoonSvg } from '@/assets/icons/ic_moon.svg';
import { ReactComponent as Calendar } from '@/assets/icons/ic_calendar_black.svg';
import { ReactComponent as ArrowRight } from '@/assets/icons/ic_arrow_right.svg';
import { ReactComponent as ExpandMore } from '@/assets/icons/ic_expand.svg';

import { MyModal } from '@/components/basic/modal';

import dayjs from 'dayjs';
import MyCardContentMulti from '@/components/basic/card-content/CardContentMulti';
import { css } from '@emotion/react';
import ViewGuestRoomSharing from '../room-sharing-view-guest/ViewGuestRoomSharing';
import RoomSharingCRU from '../room-sharing-cru/RoomSharingCRU';

const ViewRoomSharing: React.FC<{
  guestSelected: any;
  visible: boolean;
  setPageData: (data: any) => void;
  onCancel: () => void;
  title: string;
  pageData: any[];
}> = props => {
  const { visible, onCancel, title, setPageData, pageData } = props;
  const [guestSelected, setGuestSelected] = useState(props.guestSelected);
  const [isVisible, setVisible] = useState(visible);
  const [isViewGuest, setIsViewGuest] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  useEffect(() => {
    setVisible(visible);
    console.log(guestSelected);
  }, [visible]);

  const handleBack = () => {
    setIsModalEdit(false);
    setTimeout(() => {
      setVisible(true);
    }, 100);
  };

  const handleOkEdit = () => {
    setIsModalEdit(false);
    onCancel();
  };

  return (
    <div>
      <MyModal
        width={560}
        title={title}
        open={isVisible}
        onCancel={onCancel}
        footer={
          <>
            <MyButton onClick={onCancel} buttonType="outline">
              Close
            </MyButton>
            <MyButton onClick={() => setIsModalEdit(true)} icon={<Edit />}>
              Edit
            </MyButton>
          </>
        }>
        {guestSelected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <MyCardContentMulti
              items={[
                {
                  title: 'Guest name',
                  content: (
                    <>
                      {guestSelected.fullName ? guestSelected.fullName : '_'}
                      <ExpandMore
                        onClick={() => {
                          setIsViewGuest(true);
                          setTimeout(() => {
                            setVisible(false);
                          }, 100);
                        }}
                        style={{
                          marginLeft: 5,
                          width: 15,
                          height: 15,
                          cursor: 'pointer',
                        }}
                      />
                    </>
                  ),
                },
                {
                  title: 'Phone',
                  content: (
                    <>{guestSelected.phone ? guestSelected.phone : '_'}</>
                  ),
                },
              ]}
            />

            <MyCardContentMulti
              items={[
                {
                  title: 'Guest',
                  content: (
                    <>
                      {guestSelected.guest === 'adult'
                        ? 'Adult'
                        : guestSelected.guest === 'over_6'
                        ? 'Over 6 Years Old'
                        : 'Under 6 Years Old'}
                    </>
                  ),
                },
                {
                  title: 'ARRIVAL DATE - DEPARTURE DATE',
                  content: (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 10,
                        alignItems: 'center',
                      }}>
                      <Calendar />
                      <div>
                        {dayjs(guestSelected.arrivalDate).format('DD/MM/YYYY')}
                      </div>
                      <ArrowRight />
                      <div>
                        {dayjs(guestSelected.departureDate).format(
                          'DD/MM/YYYY'
                        )}
                      </div>
                      <div className="count-night" css={countNightStyle}>
                        <MoonSvg />
                        <span>
                          {dayjs(guestSelected.departureDate).diff(
                            dayjs(guestSelected.arrivalDate),
                            'day'
                          )}
                        </span>
                        <span>
                          Night
                          {dayjs(guestSelected.arrivalDate).diff(
                            dayjs(guestSelected.departureDate),
                            'day'
                          ) !== 1
                            ? 's'
                            : ''}
                        </span>
                      </div>
                    </div>
                  ),
                },
              ]}
            />

            <MyCardContent title="Remark">
              <div>{guestSelected.remark ? guestSelected.remark : '_'}</div>
            </MyCardContent>
          </div>
        ) : (
          <></>
        )}
      </MyModal>
      <ViewGuestRoomSharing
        setPageData={setPageData}
        setGuestSelected={setGuestSelected}
        visible={isViewGuest}
        title="View Guest Info"
        guestSelected={guestSelected}
        onCancel={() => {
          setIsViewGuest(false);
          setTimeout(() => {
            setVisible(true);
          }, 100);
        }}
      />

      <RoomSharingCRU
        title="Edit Room Sharing"
        setPageData={setPageData}
        visible={isModalEdit}
        onOk={handleOkEdit}
        onCancel={() => setIsModalEdit(false)}
        onBack={handleBack}
        guestData={guestSelected}
        pageData={pageData}
      />
    </div>
  );
};

export default ViewRoomSharing;

const countNightStyle = css`
  padding: 2px 8px;
  border-radius: 8px;
  display: flex;
  gap: 5px;
  background-color: #bbf7d0;
  color: #166534;
  align-items: center;
  font-size: 13px;
`;
