/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { ReactComponent as PlusSvg } from '@/assets/icons/ic_green-plus.svg';
import './SpecialService.less';
import { MyButton } from '@/components/basic/button';
import AddSpecialService from '@/components/business/modal/group-booking-special-service/AddSpecialService';
import { ISpecialServiceList } from '../special-service/type';
import { MyCardContent } from '@/components/basic/card-content';
import { message } from 'antd';
import { IndividualListItem } from '../individual-list/IndividualList.types';

interface IProps {
  arrDeptDate?: [string, string] | null;
  setSpecialServiceList: React.Dispatch<
    React.SetStateAction<ISpecialServiceList[]>
  >;
  specialServiceList: ISpecialServiceList[];
  isColRoom?: boolean;
  isAdd?: boolean;
  hotelIdSelected: string | null;
  individualList?: IndividualListItem[];
  setIndividualList?: React.Dispatch<
    React.SetStateAction<IndividualListItem[]>
  >;
  isEdit?: boolean;
}
const SpecialServiceItem = (props: IProps) => {
  const {
    arrDeptDate,
    isAdd = false,
    specialServiceList,
    setSpecialServiceList,
    hotelIdSelected,
    individualList,
    setIndividualList,
    isEdit = false,
  } = props;

  const [isModalAddSpecialService, setIsModalAddSpecialService] =
    useState(false);

  const showModalAddSpecialService = () => {
    setIsModalAddSpecialService(true);
  };

  const handleBackAddSpecialService = () => {
    setIsModalAddSpecialService(false);
  };

  const handleCancelAddSpecialService = () => {
    setIsModalAddSpecialService(false);
  };

  const renderSpecialServices = () => {
    const maxVisible = 5;
    const sortedServiceCodes = specialServiceList
      .map(service => service.serviceCode)
      .sort((a, b) => a.localeCompare(b));
    const hiddenCount = sortedServiceCodes.length - maxVisible;

    return (
      <div
        className="special-service-container"
        style={{ cursor: 'pointer' }}
        onClick={showModalAddSpecialService}>
        {sortedServiceCodes.slice(0, maxVisible).map((serviceCode, index) => (
          <div key={index} className="special-service-item">
            {serviceCode.slice(0, 2)}
          </div>
        ))}

        {hiddenCount > 0 && (
          <div className="hidden-service-item">+{hiddenCount}</div>
        )}
      </div>
    );
  };

  return (
    <>
      <MyCardContent
        title={<span className="special-service-title">SPECIAL SERVICE</span>}
        moreAction={
          !isEdit && (
            <>
              {specialServiceList.length > 0 ? (
                <MyButton
                  className="more-btn detail-btn"
                  buttonType="outline"
                  icon={<PlusSvg />}
                  onClick={showModalAddSpecialService}>
                  <span style={{ fontSize: '13px' }}>Detail</span>
                </MyButton>
              ) : (
                <MyButton
                  className="more-btn detail-btn"
                  buttonType="outline"
                  icon={<PlusSvg />}
                  onClick={() => {
                    hotelIdSelected === null || hotelIdSelected === 'N/A'
                      ? message.warning('Please select hotel to process')
                      : showModalAddSpecialService();
                  }}>
                  <span style={{ fontSize: '13px' }}>Add</span>
                </MyButton>
              )}
            </>
          )
        }>
        {renderSpecialServices()}
      </MyCardContent>
      <AddSpecialService
        onCancel={handleCancelAddSpecialService}
        visible={isModalAddSpecialService}
        onBack={handleBackAddSpecialService}
        specialServiceList={specialServiceList}
        setSpecialServiceList={setSpecialServiceList}
        individualList={individualList}
        setIndividualList={setIndividualList}
        arrDeptDate={arrDeptDate}
        isAdd={isAdd}
        hotelId={hotelIdSelected}
      />
    </>
  );
};

export default SpecialServiceItem;
