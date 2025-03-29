import { SharedLayout } from '@/components/business/layouts/shared-layout';
import React, { useCallback, useEffect, useState } from 'react';
import Columns, { DataTypeCoumn } from './Columns';
import mockData from '@/mocks/table';
import { QuickSearchForm } from './QuickSearchForm';
import AdvancedSearchForm from './AdvanceSearchForm';
import dayjs from 'dayjs';
import './style.less';
import { apiBookingSearch } from '@/api/features/booking';
import { Button, TableProps, message } from 'antd';
import {
  BookingRow,
  DataType,
} from '@/components/business/layouts/shared-layout/type';
import { ColumnsType } from 'antd/es/table';
import { ReactComponent as PencilSvg } from '@/assets/icons/ic_pencil.svg';
import { ReactComponent as ImportSvg } from '@/assets/icons/ic_import.svg';
import { ReactComponent as PlusSvg } from '@/assets/icons/ic_plus_circle.svg';
import { ReactComponent as CloseSvg } from '@/assets/icons/ic_close.svg';
import { formatDateTable } from '@/utils/formatDate';
import { BOOKING_STATUS, BOOKING_TYPE } from '@/constants/booking';
import { useNavigate } from 'react-router-dom';
import { MyButton } from '@/components/basic/button';
import ActionButton from '@/components/basic/table/TableActionButton';
import { GuestInfoCRU } from '@/components/business/modal/guest-info-cru';
import ServiceInfoCru from '@/components/business/modal/service-info-cru/ServiceInfoCru';
import DeleteModal from '@/components/business/modal/shared-delete-confirm/SharedDeleteConfirm';
import { RoomSharingImport } from '@/components/business/modal/room-sharing-import';
import { CancelIndividualGroupBooking } from '@/components/business/modal/group-booking-cancel-individual';
import { ISource } from '@/utils/formatSelectSource';
import { apiHotelList } from '@/api/features/myAllotment';
import {
  apiImportFile,
  apiServiceSearch,
  deleteService,
} from '@/api/features/service';
import { formatNumberMoney, isAllEmptyStrings } from '@/utils/common';
import { exportTemplateToExcel } from '@/utils/exportExcel';
import moment from 'moment';
const ServiceContainer = () => {
  const [openNew, setOpenNew] = useState<boolean>(false);
  const [hotelList, setHotelList] = useState<ISource[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [titl, setTitl] = useState('');
  const [pageData, setPageData] = useState<any[]>([]);
  const [id, setId] = useState('');
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [idGuestSelect, setIdGuestSelect] = useState<any>(undefined);
  const [viewMode, setViewMode] = useState(false);
  const [isModalCancel, setIsModalCancel] = useState(false);
  const [selectedRows, setSelectedRows] = useState<BookingRow[]>([]);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);
  const [isModalImport, setIsModalImport] = useState(false);
  const [selectedHotelIds, setSelectedHotelIds] = useState<string | null>('26');
  // const [isVisible, setVisible] = useState(visible);
  const initialAdvanceSearchState = {
    // bookingNo: '',
  };
  const onFinishEdit = () => {
    setForceUpdate(!forceUpdate);
  };
  const switchEditMode = () => {
    setViewMode(false);
  };
  useEffect(() => {
    const fetchHotelList = async () => {
      try {
        const hotelListRes = await apiHotelList();
        if (hotelListRes && hotelListRes.data.length > 0) {
          const data: ISource[] = hotelListRes.data.map((item: any) => ({
            label: item.short_name,
            value: item.id,
          }));
          setHotelList(data);
          console.log(data?.[0]?.value);
          setSelectedHotelIds(data?.[0]?.value);
        }
      } catch (error) {
        console.error('Error fetching hotel list:', error);
      }
    };

    fetchHotelList();
  }, []);
  const handleClickCode = (code: string, _record: Record<string, any>) => {
    setId(_record.id);
    setOpenEdit(!openEdit);
    // setSelectedData(record as IFormViewHotel);
    setViewMode(true);
  };
  console.log('check _ididdi', idGuestSelect);

  const handleDelete = async (_id: string) => {
    const k = await deleteService(_id);
    setIdGuestSelect(undefined);
    setIsModalDelete(false);
    setForceUpdate(!forceUpdate);
    if (isAllEmptyStrings(k)) {
      message.success('Delete rate code successfully!');
    }
  };
  const onCancelDelete = () => {
    setIdGuestSelect(undefined);
    setIsModalDelete(false);
  };

  const handleOkCancel = async () => {
    setIsModalCancel(false);
    setForceUpdate(!forceUpdate);
  };
  const handelFinishCreate = () => {
    setId('');
    setOpenNew(!openNew);
    setForceUpdate(!forceUpdate);
    setViewMode(false);
  };
  const handelCancel = () => {
    setOpenNew(!openNew);
  };
  const handleCancelCancel = () => {
    setIsModalCancel(false);
  };

  //import
  const handleCancel = () => {
    setIsModalImport(false);
  };
  const handleImportOk = () => {
    setForceUpdate(!forceUpdate);
    setIsModalImport(false);
  };
  const handleBack = () => {
    setIsModalImport(false);
  };
  const navigate = useNavigate();
  const handleAdvanceSearch = useCallback(() => {
    // Xử lý logic tìm kiếm nâng cao tại đây
  }, []);
  const advanceSearchOptions = {
    advanceSearchFields: <AdvancedSearchForm />,
    initialValueAdvanceSearch: initialAdvanceSearchState,
  };

  const quickSearchOptions = {
    quickSearchFields: <QuickSearchForm hotelList={hotelList} />,
  };

  const fileName = `Service`;

  const handleEdit = (_id: string) => {
    setId(_id);
    setOpenEdit(!openEdit);
    setViewMode(false);
  };

  const extendedColumns: ColumnsType<DataTypeCoumn> = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      fixed: 'left',
      width: 120,
      render: (text: string, record: Record<string, any>) => (
        <div
          style={{
            cursor: 'pointer',
            textDecoration: 'underline',
            textAlign: 'left',
          }}
          onClick={() => handleClickCode(text, record)}
        >
          {record.code}
        </div>
      ),
    },
    ...Columns,
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      align: 'center',
      width: 100,
      render: (_item, _record) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
          }}
        >
          <ActionButton
            icon={<PencilSvg />}
            onClick={() => handleEdit(String(_record.id))}
            tooltipTitle="Edit"
          />
          <ActionButton
            icon={<CloseSvg />}
            onClick={() => {
              setIdGuestSelect(_record.id);
              setIsModalDelete(true);
            }}
            tooltipTitle="Delete"
          />
        </div>
      ),
    },
  ];
  const formatDataBeforeExport = (data: any[]) => {
    return data.map(row => {
      const formattedRow: Record<string, any> = {};
      extendedColumns.forEach((col: any) => {
        if (col.dataIndex) {
          let value;

          // Gán giá trị cho từng trường dựa trên dataIndex
          if (col.dataIndex === 'code') {
            value = row['code']; // Gán tên khách sạn
          } else if (col.dataIndex === 'hotel') {
            value = row['hotel']?.short_name; // Gán tên khách
          } else if (
            col.dataIndex === 'adult_price' ||
            col.dataIndex === 'over_6_years_price' ||
            col.dataIndex === 'under_6_years_price'
          ) {
            value = formatNumberMoney(row[col.dataIndex]);
          } else if (col.dataIndex === 'status') {
            value = row[col.dataIndex] === 'published' ? 'Active' : 'Inactive';
          } else if (
            col.dataIndex === 'date_created' ||
            col.dataIndex === 'date_updated'
          ) {
            value = row[col.dataIndex]
              ? moment(row[col.dataIndex]).format('DD/MM/YYYY HH:mm')
              : '';
          } else if (
            col.dataIndex === 'user_updated' ||
            col.dataIndex === 'user_created'
          ) {
            value =
              row[col.dataIndex]?.last_name && row[col.dataIndex]?.first_name
                ? row[col.dataIndex]?.last_name +
                  ' ' +
                  row[col.dataIndex]?.first_name
                : '';
          } else {
            value = row[col.dataIndex] ?? ''; // Gán giá trị mặc định
          }
          // Gán giá trị đã định dạng vào formattedRow
          formattedRow[col.dataIndex] = value;
        }
      });
      return formattedRow;
    });
  };
  const handleDeleteMany = async () => {
    console.log('check row select', selectedRows);
    const idsToDelete = selectedRows.map(row => row.id); // Lấy danh sách ID
    // Gọi API xóa nhiều mục
    const k = await Promise.all(idsToDelete.map(id => deleteService(id))); // Xóa từng mục (nếu API không hỗ trợ xóa nhiều)
    // Hoặc sử dụng một API xóa nhiều nếu có:
    // await deleteManyService(idsToDelete);

    setIsModalDelete(false);
    setForceUpdate(!forceUpdate);
    setSelectedRows([]); // Reset danh sách đã chọn
    if (isAllEmptyStrings(k)) {
      message.success('Delete rate code successfully!');
    }
  };
  const handleCustomDelete = () => {
    if (selectedRows && selectedRows.length > 0 && !idGuestSelect) {
      handleDeleteMany();
    } else {
      if (idGuestSelect) {
        handleDelete(idGuestSelect);
      }
    }
  };
  const customButtons = (
    <>
      <MyButton
        buttonType="outline"
        className="icon-button"
        icon={<PlusSvg width={12} height={12} />}
        onClick={() => setOpenNew(!openNew)}
      >
        Add
      </MyButton>
      <MyButton
        buttonType="outline"
        className="icon-button"
        icon={<ImportSvg width={12} height={12} />}
        onClick={() => setIsModalImport(!isModalImport)}
      >
        Import
      </MyButton>
      <MyButton
        buttonType="outline"
        className="icon-button"
        icon={<CloseSvg width={14} height={14} />}
        onClick={() => {
          if (!selectedRows || selectedRows.length === 0) {
            message.warning('Please select the data row to process');
            return;
          }
          setIsModalDelete(true);
        }}
      >
        Delete
      </MyButton>
    </>
  );

  const generateExcel = async () => {
    try {
      const hotelList = await apiHotelList();

      const hotelData =
        hotelList?.data?.map((item: any) => ({
          hotel_code: item.code,
          hotel_name: item.full_name,
        })) || [];

      const fileName = 'import_service_template';

      const downFile = await exportTemplateToExcel(
        [
          {
            name: 'Service',
            headers: [
              { key: 'no', title: 'No (STT)' },
              {
                key: 'hotel_code',
                title: 'Hotel Code (*)\n(Mã khách sạn)',
                description: `Admin:\nBắt buộc\nNhập mã khách sạn theo sheet Hotel`,
              },
              {
                key: 'service_code',
                title: 'Code (*)\n(Mã service)',
                description: `Admin:\nBắt buộc\nViết liền, không dấu tiếng Việt\nKhông cho phép nhập các ký tự đặc biệt sau: \n~!@$%^&(){}[]|' " ;<>`,
              },
              {
                key: 'service_name',
                title: 'Name (*)\n(Tên service)',
                description: `Admin:\nBắt buộc`,
              },
              { key: 'description', title: 'Description\n(Mô tả)' },
              {
                key: 'adult_price',
                title: 'Adult Price (*)\n(Giá người lớn)',
                description: `Admin:\nBắt buộc\nChỉ nhập số nguyên dương, ngăn cách các hàng bằng dấu chấm "."`,
              },
              {
                key: 'over_6_years_price',
                title:
                  'Over 6 Years Price (*)\n(Giá trẻ em từ 6 tới dưới 12 tuổi)',
                description: `Admin:\nBắt buộc\nChỉ nhập số nguyên dương, ngăn cách các hàng bằng dấu chấm "."`,
              },
              {
                key: 'under_6_years_price',
                title: 'Under 6 Years Price (*)\n(Giá trẻ em dưới 6 tuổi)',
                description: `Admin:\nBắt buộc\nChỉ nhập số nguyên dương, ngăn cách các hàng bằng dấu chấm "."`,
              },
            ],
            data: [],
          },
          {
            name: 'Hotel',
            headers: [
              { key: 'hotel_code', title: 'Hotel Code' },
              { key: 'hotel_name', title: 'Hotel Name' },
            ],
            data: hotelData,
          },
        ],
        fileName
      );

      return downFile;
    } catch (error) {
      console.error('Lỗi khi tạo file Excel:', error);
    }
  };

  return (
    <>
      <SharedLayout
        columns={extendedColumns}
        pageApi={apiServiceSearch}
        quickSearchOptions={quickSearchOptions}
        advanceSearchOptions={advanceSearchOptions}
        onSearch={handleAdvanceSearch}
        fileName={fileName}
        multipleSelection
        formatDataBeforeExport={formatDataBeforeExport}
        customButtons={customButtons}
        setSelectedRowData={setSelectedRows}
        forceUpdate={forceUpdate}
        tableScrollY={`calc(100vh - ${270}px)`}
        messageExportSuccess="Export service succesfully"
      />

      <ServiceInfoCru
        open={openNew}
        setOpen={setOpenNew}
        isShowOverView={false}
        title="New Service"
        onFinish={handelFinishCreate}
        onCancel={handelCancel}
        isShowContinues={false}
        hotelList={hotelList}
        sourcePopup="master"
        isAdd
      />
      <ServiceInfoCru
        id={id}
        hotelList={hotelList}
        title={viewMode ? 'View Service' : 'Edit Service'}
        open={openEdit}
        setOpen={setOpenEdit}
        onFinish={onFinishEdit}
        isViewMode={viewMode}
        switchEditMode={switchEditMode}
        sourcePopup="master"
      />
      <DeleteModal
        content="Are you sure to delete the record(s)?"
        visible={isModalDelete}
        onOk={handleCustomDelete}
        onCancel={onCancelDelete}
      />
      <RoomSharingImport
        title="Import Service"
        visible={isModalImport}
        onOk={handleImportOk}
        onCancel={handleCancel}
        onBack={handleBack}
        apiImport={apiImportFile}
        expectedHeaders={[
          'No',
          'Hotel Code',
          'Code',
          'Name',
          'Description',
          'Adult Price',
          'Over 6 Years Price',
          'Under 6 Years Price',
        ]}
        onDownloadTemplate={generateExcel}
      />
    </>
  );
};

export default ServiceContainer;
