import React, { useEffect, useState } from 'react';
import { Flex, Popover, Table } from 'antd';
import './style.less';
import '../special-service/style.less';
import { IRateInfoItem, IRateInfoProps } from './type';
import { formatNumberMoney } from '@/utils/common';
import { formatDateTable } from '@/utils/formatDate';
import { ReactComponent as InforSvg } from '@/assets/icons/ic_infor.svg';
import { ReactComponent as AdultSvg } from '@/assets/icons/ic_adult.svg';
import { ReactComponent as ChildSvg } from '@/assets/icons/ic_child.svg';
import { ReactComponent as ChangeSvg } from '@/assets/icons/ic_change_rate.svg';
import TableWithRowTotal from '@/components/basic/table/TableWithRowTotal';
import { TableNoData } from '@/components/basic/table';
import { ChangeInfor } from '../modal/individual-booking-change-info';
import { ViewRoomDate } from '../modal/room-date-view';
import ModalDetailBooking from '@/containers/booking/view-booking/component/ModalDetailBooking';
import { RenderViewRateDetail } from '@/containers/booking/view-booking/component/RenderViewRateDetail';
import { selectPackageList } from '@/stores/slices/packageList.slice';
import { useSelector } from 'react-redux';

const RateInfo = (props: IRateInfoProps) => {
  const {
    rateInfoList = [],
    setTotalRoomCharge,

    errorRateInfor,
    setRateInfoList,
    isView = true,
    childNum,
    adultNum,
    arrDeptDate,
  } = props;
  const [mainTableSelectedRowKeys, setMainTableSelectedRowKeys] = useState<
    React.Key[]
  >([]);
  const [recordView, setRecordView] = useState<IRateInfoItem>();
  const [isModalView, setIsModalView] = useState(false);
  const [changeInforVisible, setChangeInforVisible] = useState<boolean>(false);
	const packageList = useSelector(selectPackageList);
  const mainTableRowSelection = {
    selectedRowKeys: mainTableSelectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setMainTableSelectedRowKeys(selectedRowKeys);
    },
  };
  const totalSum = rateInfoList
    .filter(item => item.rate != null)
    .reduce((sum, item) => sum + item.rate, 0);
  const handleViewDetail = (record: IRateInfoItem) => {
    setRecordView(record);
    setIsModalView(true);
  };

  useEffect(() => {
    if (totalSum && setTotalRoomCharge) {
      setTotalRoomCharge(totalSum);
    }
  }, [totalSum]);

  const handleReset = () => {
    setMainTableSelectedRowKeys([]);
  };

  const columns = [
    {
      title: 'No',
      dataIndex: 'No',
      key: 'No',
      width: 50,
      render: (_text: string, _record: any, index: number) => (
        // <a onClick={() => handleViewDetail(_record)}>{`#${index + 1}`}</a>
        <span>{`${index + 1}`}</span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (date: string, _record: any, index: number) => {
        return (
          <a
            style={{
              color: errorRateInfor?.some(error => error.row === index)
                ? '#DC2626'
                : '#1C1917',
              textDecoration: 'underline',
            }}
            onClick={() => handleViewDetail(_record)}>
            {date ? formatDateTable(date) : '-'}
          </a>
        );
      },
    },
    {
      title: 'Source ID',
      dataIndex: 'id',
      key: 'ID',
      width: 120,
      render: (text: any, record: any) => {
        // console.log(record);
        return <span>{record.id}</span>;
      },
    },
    {
      title: 'Room Type',
      dataIndex: 'roomType',
      key: 'roomType',
      width: 150,
    },
    ...(isView
      ? [
          {
            title: 'Guest',
            dataIndex: 'guest',
            key: 'Guest',
            width: 116,
            render: (_: any, record: any) => {
              const adultsMatch = record.totalAdults;
              const childrenMatch = record.totalChildren;

              const adultsCount = Number(adultsMatch);
              const childrenCount = Number(childrenMatch);
              return (
                <>
                  {(adultsCount > 0 || childrenCount > 0) && (
                    <div
                      style={{
                        background: '#F5F5F4',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px 6px',
                        maxWidth: '120px',
                        justifyContent: 'center',
                      }}>
                      {/* Icon người lớn */}
                      {adultsCount >= 0 && (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <AdultSvg
                            height={14}
                            width={14}
                            style={{ marginRight: '5px' }}
                          />
                          {adultsCount}
                        </span>
                      )}
                      {childrenCount >= 0 && (
                        <div
                          style={{
                            background: '#CACACA',
                            width: '1px',
                            height: '14px',
                            margin: '0px 8px 0 10px',
                          }}></div>
                      )}
                      {/* Icon trẻ em */}
                      {childrenCount >= 0 && (
                        <span
                          style={{
                            // marginLeft: '10px',
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          <ChildSvg
                            height={14}
                            width={14}
                            style={{ marginRight: '5px' }}
                          />
                          {childrenCount}
                        </span>
                      )}
                    </div>
                  )}
                </>
              );
            },
          },
          {
            title: 'Package',
            dataIndex: 'package',
            key: 'package',
            width: 100,
            render: (text: any, record: any) => {
							const packageCode = record.packageCode;
							const matchingPackage = packageList?.find(
								pkg => pkg.value === packageCode
							);

							return (
								<Flex justify="space-between" align="center">
									{text}
									<Popover
										content={
											<span>
												Service:{' '}
												{matchingPackage?.packages
													?.map((pkg: any) => pkg.service_id?.name)
													.join(', ') || ''}
											</span>
										}
										className="popover-package"
										overlayClassName="popover-package">
										{text && text !== '-' && (
											<InforSvg height={15} width={15} className="icon-infor" />
										)}
									</Popover>
								</Flex>
							);
						},
          },
        ]
      : [
          {
            title: 'Package',
            dataIndex: 'package',
            key: 'package',
            width: 116,
            render: (text: any, record: any) => {
							const packageCode = record.packageCode;
							const matchingPackage = packageList?.find(
								pkg => pkg.value === packageCode
							);

							return (
								<Flex justify="space-between" align="center">
									{text}
									<Popover
										content={
											<span>
												Service:{' '}
												{matchingPackage?.packages
													?.map((pkg: any) => pkg.service_id?.name)
													.join(', ') || ''}
											</span>
										}
										className="popover-package"
										overlayClassName="popover-package">
										{text && text !== '-' && (
											<InforSvg height={15} width={15} className="icon-infor" />
										)}
									</Popover>
								</Flex>
							);
						},
          },
          {
            title: 'Guest',
            dataIndex: 'guest',
            key: 'Guest',
            width: 116,
            render: (_: any, record: any) => {
              const adultsMatch = record.totalAdults;
              const childrenMatch = record.totalChildren;

              const adultsCount = Number(adultsMatch);
              const childrenCount = Number(childrenMatch);
              return (
                <>
                  {(adultsCount >= 0 || childrenCount >= 0) && (
                    <div
                      style={{
                        background: '#F5F5F4',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px 6px',
                        maxWidth: '120px',
                        justifyContent: 'center',
                      }}>
                      {/* Icon người lớn */}
                      {adultsCount >= 0 && (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          <AdultSvg
                            height={14}
                            width={14}
                            style={{ marginRight: '5px' }}
                          />
                          {adultsCount}
                        </span>
                      )}
                      {childrenCount >= 0 && (
                        <div
                          style={{
                            background: '#CACACA',
                            width: '1px',
                            height: '14px',
                            margin: '0px 8px 0 10px',
                          }}></div>
                      )}
                      {/* Icon trẻ em */}
                      {childrenCount >= 0 && (
                        <span
                          style={{
                            // marginLeft: '10px',
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          <ChildSvg
                            height={14}
                            width={14}
                            style={{ marginRight: '5px' }}
                          />
                          {childrenCount}
                        </span>
                      )}
                    </div>
                  )}
                </>
              );
            },
          },
        ]),

    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      className: 'text-right',
      width: 100,
      render: (value: number) => value > 0 && formatNumberMoney(value),
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark',
      width: 212,
    },
  ];

  const formatedDataSource =
    rateInfoList.length > 0
      ? rateInfoList.map(item => ({
          No: item.No,
          date: item.date,
          hotelId: item.hotelId,
          id: item.sourceId,
          roomType: item.roomType,
          guest: item.guest,
          totalAdults: item.adults,
          totalChildren: item.children,
          rate: item.rate,
          package: item.package,
          packageCode: item.packageCode,
          remark: item.remark,
          sourceName: item.sourceName,
        }))
      : [];
  const change =
    mainTableSelectedRowKeys.length > 0 &&
    rateInfoList
      .filter(item => mainTableSelectedRowKeys.includes(item.No))
      .every(item => item.adults);

  const errorMessages = Array.from(
    new Set(errorRateInfor?.map(error => error.field))
  ).join(', ');
  return (
    <>
      {formatedDataSource.length > 0 ? (
        <>
          {isView && (
            <div
              className="change-rate"
              style={{
                cursor: change ? 'pointer' : 'not-allowed',
                opacity: change ? 1 : 0.5,
              }}
              onClick={event => {
                event.stopPropagation();
                if (change) {
                  setChangeInforVisible(true);
                }
              }}>
              <ChangeSvg />
              <span>Change</span>
            </div>
          )}
          <TableWithRowTotal
            dataSource={formatedDataSource}
            columns={columns}
            rowSelection={isView ? mainTableRowSelection : undefined}
            rowKey="No"
            total={totalSum}
          />
          {errorMessages && (
            <div
              style={{
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '5px',
              }}>
              <InforSvg width={15} height={15} className="icon-infor-error" />
              {errorMessages} are required for each day!
            </div>
          )}
        </>
      ) : (
        <TableNoData
          handleReset={handleReset}
          label="Reset"
          isSearched={false}
        />
      )}

      {isView ? (
        <ViewRoomDate
          childNum={childNum}
          adultNum={adultNum}
          visible={isModalView}
          record={recordView as IRateInfoItem}
          onOk={() => {}}
          onCancel={() => setIsModalView(false)}
          rateInfoList={rateInfoList}
          setRateInfoList={setRateInfoList}
        />
      ) : (
        <ModalDetailBooking
          isOpen={isModalView}
          title={'View Room Date'}
          onClose={() => setIsModalView(false)}
          children={<RenderViewRateDetail data={recordView as IRateInfoItem} />}
          maxContentWidth={'700px'}
          isFooter
        />
      )}
      <ChangeInfor
        adultNum={adultNum}
        childNum={childNum}
        rateInfoList={rateInfoList}
        arrDeptDate={arrDeptDate}
        setRateInfoList={setRateInfoList}
        rateInfoSelected={mainTableSelectedRowKeys}
        visible={changeInforVisible}
        onOk={() => {}}
        onCancel={() => {
          setChangeInforVisible(false);
        }}
      />
    </>
  );
};

export default RateInfo;
