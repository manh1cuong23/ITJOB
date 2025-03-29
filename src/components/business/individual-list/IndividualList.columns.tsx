import { ColumnsType } from 'antd/es/table';
import { DataTypeCoumn } from '@/containers/booking/Columns';
import { formatNumberMoney } from '@/utils/common';
import { ReactComponent as AdultSvg } from '@/assets/icons/ic_adult.svg';
import { ReactComponent as ChildSvg } from '@/assets/icons/ic_child.svg';
import { ReactComponent as InforSvg } from '@/assets/icons/ic_infor.svg';
import { ReactComponent as CloseSvg } from '@/assets/icons/ic_close.svg';
import { ReactComponent as DeleteSvg } from '@/assets/icons/ic-delete.svg';
import { ReactComponent as PencilSvg } from '@/assets/icons/ic_pencil.svg';
import { ReactComponent as PencilLineSvg } from '@/assets/icons/ic_pencil-line.svg';
import { Popover, Flex, Tooltip } from 'antd';
import { IndividualListItem, IPackage } from './IndividualList.types';
import ActionButton from '@/components/basic/button/Action';
import { NavigateFunction } from 'react-router-dom';
import { formatDateTable } from '@/utils/formatDate';
import { STATUS_BOOKING } from '@/constants/page';
import { ISource } from '@/utils/formatSelectSource';

interface ColumnProps {
  packageList: ISource[];
  showModalRateInfo: (record: IndividualListItem) => void;
  showModalSpecialService: (record: IndividualListItem) => void;
  showDelete: (no?: string) => void;
  goToIndividualView: (record: any) => void;
  goToIndividualEdit: (record: any, index: number) => void;
  isEdit?: boolean;
  handleCancel: (record?: any) => void;
}

export const IndividualListColumns = ({
  packageList,
  showModalRateInfo,
  showModalSpecialService,
  showDelete,
  goToIndividualView,
  goToIndividualEdit,
  isEdit = false,
  handleCancel,
}: ColumnProps): ColumnsType<DataTypeCoumn> => [
  {
    title: 'Room No',
    dataIndex: 'roomNo',
    key: 'roomNo',
    width: 80,
    render: (_text: string, record: any) => {
      return (
        <a
          style={{ color: '#1C1917', textDecoration: 'underline' }}
          onClick={() => goToIndividualView(record)}
        >
          {_text}
        </a>
      );
    },
  },
  ...(isEdit
    ? [
        {
          title: 'Status',
          dataIndex: 'bookingStatus',
          key: '4',
          width: '100px',
          render(value: number, record: any, index: number) {
            console.log(record);
            let label = '';

            const getStyleStatus = () => {
              switch (value) {
                case STATUS_BOOKING.WARNING:
                  label = 'Waiting';
                  return 'status-waiting-booking';
                case STATUS_BOOKING.REJECTED:
                  label = 'Rejected';
                  return 'status-rejected-booking';
                case STATUS_BOOKING.CONFIRMED:
                  label = 'Confirmed';
                  return 'status-confirmed-booking';
                case STATUS_BOOKING.CHECKED_IN:
                  label = 'Checked In';
                  return 'status-checked-in-booking';
                case STATUS_BOOKING.CHECK_OUT:
                  label = 'Checked out';
                  return 'status-checked-out-booking';
                case STATUS_BOOKING.CANCELED:
                  label = 'Cancelled';
                  return 'status-cancelled-booking';
                case STATUS_BOOKING.CLOSED:
                  label = 'Closed';
                  return 'status-closed-booking';
                default:
                  label = '-';
                  return '';
              }
            };
            return (
              <div
                className={getStyleStatus()}
                style={{ width: 'fit-content' }}
              >
                {label}
              </div>
            );
          },
        },
      ]
    : []),
  {
    title: 'Source ID',
    dataIndex: 'sourceId',
    key: 'sourceId',
    width: 120,
  },
  {
    title: 'Room Type',
    dataIndex: 'roomType',
    key: 'roomType',
    width: 120,
  },
  {
    title: 'Package',
    dataIndex: 'package',
    key: 'package',
    width: 120,
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
                  ?.map((pkg: any) => pkg.package_id?.name)
                  .join(', ') || ''}
              </span>
            }
            className="popover-package"
            overlayClassName="popover-package"
          >
            {text && <InforSvg height={15} width={15} className="icon-infor" />}
          </Popover>
        </Flex>
      );
    },
  },
  {
    title: 'Arrival Date',
    dataIndex: 'arrivalDate',
    key: 'arrivalDate',
    width: 120,
    render: (date: string) => {
      return date ? formatDateTable(date) : '-';
    },
  },
  {
    title: 'Departure Date',
    dataIndex: 'departureDate',
    key: 'departureDate',
    width: 120,
    render: (date: string) => {
      return date ? formatDateTable(date) : '-';
    },
  },
  {
    title: 'Guest',
    dataIndex: 'guest',
    key: 'Guest',
    render: (_: any, record: any) => {
      const adultsCount = Number(record.adults);
      const childrenCount = Number(record.numChildren);
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
                maxWidth: '100px',
                justifyContent: 'center',
              }}
            >
              {adultsCount > 0 && (
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
                  }}
                ></div>
              )}
              {childrenCount >= 0 && (
                <span style={{ display: 'flex', alignItems: 'center' }}>
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
    title: 'Room Charge',
    dataIndex: 'rate',
    key: 'totalRate',
    className: 'text-right',
    width: 120,
    render: (value: number, record: any, index: number) => {
      return (
        <a
          style={{ textDecoration: 'underline' }}
          onClick={() => showModalRateInfo(record)}
        >
          {formatNumberMoney(value)}
        </a>
      );
    },
  },
  {
    title: 'Special Service',
    dataIndex: 'specialServices',
    key: 'specialServices',
    render: (_text: string, record: any, index: number) => {
      const specialServices = record.specialServices || [];
      const displayedServices = specialServices.map(
        (service: any) => service.serviceCode
      );

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'context-menu',
          }}
          className="remark-wrapper"
        >
          <Tooltip title={displayedServices.join(', ')}>
            <span>
              {displayedServices.length > 0
                ? displayedServices.join(', ')
                : '-'}
            </span>
          </Tooltip>
          <PencilLineSvg
            onClick={() => showModalSpecialService(record)}
            className="edit-special-service"
            style={{ cursor: 'pointer', minWidth: '14px' }}
            width={14}
            height={14}
          />
        </div>
      );
    },
  },
  {
    title: 'Special Service Charge',
    dataIndex: 'specialServiceCharge',
    key: 'specialServiceCharge',
    className: 'text-right',
    width: 170,
    render: (value: number) => value > 0 && formatNumberMoney(value),
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    className: 'text-right',
    width: 100,
    render: (value: number) => value > 0 && formatNumberMoney(value),
  },
  {
    title: 'Remark',
    dataIndex: 'remark',
    key: 'remark',
    width: 100,
    render: (text: string) => {
      return (
        <div className="remark-wrapper">
          <Tooltip title={text}>
            <span style={{ cursor: 'pointer' }}>{text || '-'}</span>
          </Tooltip>
        </div>
      );
    },
  },
  ...(isEdit
    ? [
        {
          title: 'Reason',
          key: 'statusNote',
          dataIndex: 'statusNote',
          width: 150,
        },
      ]
    : []),
  {
    title: 'Actions',
    key: 'action',
    fixed: 'right',
    width: 100,
    render: (_item: string, record: any, index: number) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'baseline',
        }}
      >
        <ActionButton
          icon={<PencilSvg />}
          onClick={() => {
            goToIndividualEdit(record, index);
          }}
        />
        {isEdit ? (
          <ActionButton
            icon={<CloseSvg />}
            onClick={() => {
              handleCancel(record);
            }}
          />
        ) : (
          <ActionButton
            icon={<DeleteSvg />}
            onClick={() => {
              showDelete(record.No);
            }}
          />
        )}
      </div>
    ),
  },
];

export const IndividualListColumnsViewFirst: any = [
  {
    title: 'Status',
    dataIndex: 'bookingStatus',
    key: '4',
    width: '116px',
    render(value: number, record: any, index: number) {
      let label = '';

      const getStyleStatus = () => {
        switch (value) {
          case STATUS_BOOKING.WARNING:
            label = 'Waiting';
            return 'status-waiting-booking';
          case STATUS_BOOKING.REJECTED:
            label = 'Rejected';
            return 'status-rejected-booking';
          case STATUS_BOOKING.CONFIRMED:
            label = 'Confirmed';
            return 'status-confirmed-booking';
          case STATUS_BOOKING.CHECKED_IN:
            label = 'Checked In';
            return 'status-checked-in-booking';
          case STATUS_BOOKING.CHECK_OUT:
            label = 'Checked out';
            return 'status-checked-out-booking';
          case STATUS_BOOKING.CANCELED:
            label = 'Cancelled';
            return 'status-cancelled-booking';
          case STATUS_BOOKING.CLOSED:
            label = 'Closed';
            return 'status-closed-booking';
          default:
            label = '-';
            return '';
        }
      };
      return (
        <div className={getStyleStatus()} style={{ width: 'fit-content' }}>
          {label}
        </div>
      );
    },
  },
  {
    title: 'Source ID',
    dataIndex: 'sourceId',
    key: 'sourceId',
    width: 120,
  },
  {
    title: 'Room Type',
    dataIndex: 'roomType',
    key: 'roomType',
    width: 120,
  },
];

export const IndividualListColumnsViewMiddle: any = [
  {
    title: 'Arrival Date',
    dataIndex: 'arrivalDate',
    key: 'arrivalDate',
    width: 110,
    render: (date: string) => {
      return date ? formatDateTable(date) : '-';
    },
  },
  {
    title: 'Departure Date',
    dataIndex: 'departureDate',
    key: 'departureDate',
    width: 120,
    render: (date: string) => {
      return date ? formatDateTable(date) : '-';
    },
  },
  {
    title: 'Guest',
    dataIndex: 'guest',
    key: 'Guest',
    render: (_: any, record: any) => {
      const adultsCount = Number(record.adults);
      const childrenCount = Number(record.numChildren);
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
                maxWidth: '100px',
                justifyContent: 'center',
              }}
            >
              {adultsCount > 0 && (
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
                  }}
                ></div>
              )}
              {childrenCount >= 0 && (
                <span style={{ display: 'flex', alignItems: 'center' }}>
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
];

export const IndividualListColumnsViewLast: any = [
  {
    title: 'Special Service Charge',
    dataIndex: 'specialServiceCharge',
    key: 'specialServiceCharge',
    className: 'text-right',
    width: 170,
    render: (value: number) => value > 0 && formatNumberMoney(value),
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    className: 'text-right',
    width: 100,
    render: (value: number) => value > 0 && formatNumberMoney(value),
  },
  {
    title: 'Remark',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: 'Reason',
    key: 'statusNote',
    dataIndex: 'statusNote',
    width: 150,
  },
];
