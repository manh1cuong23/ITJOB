import React, { useState, useEffect } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as Tick } from '@/assets/icons/ic_ticks.svg';
import { ReactComponent as Import } from '@/assets/icons/ic_import.svg';
import { ReactComponent as Delete } from '@/assets/icons/ic-delete.svg';
import { Flex, Button, message } from 'antd';
import FormAddRoom from '../room-sharing-cru/RoomSharingCRU';
import { tableColumns, tableColumnsGroup } from './RoomSharingLitstColumns';
import FormImport from '../room-sharing-import/RoomSharingImport';
import { MyModal } from '@/components/basic/modal';
import './RoomSharingList.less';
import DeleteModal from '../shared-delete-confirm/SharedDeleteConfirm';
import { TableBasic } from '@/components/basic/table';
import { useSelector } from 'react-redux';
import { selectIdType } from '@/stores/slices/idType.slice';
import { RowData } from './RoomSharingList.types';

interface GuestData {
  key: number;
  no: number;
  fullName: string;
  roomNo: string;
  guestType: string;
  phone: string;
  idType: string;
  idNo: string;
  arrivalDate: string;
  departureDate: string;
  remark: string;
}

const RoomSharingGroup: React.FC<{
  firstMount?: boolean;
  setFirstMount?: (firstMount: boolean) => void;
  data: any[];
  setData: (data: any[]) => void;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  title: string;
}> = ({
  visible,
  onOk,
  onCancel,
  title,
  data,
  setData,
  firstMount,
  setFirstMount,
}) => {
  const [titl, setTitl] = useState('');
  const [isModalImport, setIsModalImport] = useState(false);
  const [isModalView, setIsModalView] = useState(false);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [isVisible, setVisible] = useState(visible);
  const [idGuestSelect, setIdGuestSelect] = useState<number | undefined>(
    undefined
  );
  const [selectedRowData, setSelectedRowData] = useState<RowData[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [guestSelected, setGuestSelected] = useState<any>(undefined);
  const [pageData, setPageData] = useState<any[]>([]);
  const idType = useSelector(selectIdType);
  const [paginationDetails, setPaginationDetails] = useState({
    current: 1,
    pageSize: 15,
    total: pageData.length,
  });

  useEffect(() => {
    setPaginationDetails({
      current: paginationDetails.current,
      pageSize: paginationDetails.pageSize,
      total: pageData.length,
    });
  }, [pageData]);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPaginationDetails({
      current: page,
      pageSize: pageSize,
      total: pageData.length,
    });
  };

  const showModalImport = () => {
    setTitl('Import Data');
    setIsModalImport(true);
    setTimeout(() => {
      setVisible(false);
    }, 100);
  };

  useEffect(() => {
    if (firstMount) {
      setPageData(data);
      setFirstMount && setFirstMount(false);
    }
  }, [firstMount, data, setFirstMount, setPageData]);

  useEffect(() => {
    setVisible(visible);
  }, [visible]);

  const handleImportOk = () => {
    setIsModalImport(false);
    setTimeout(() => {
      setVisible(true);
    }, 100);
  };

  const handleCancel = () => {
    setIsModalImport(false);
    setTimeout(() => {
      setVisible(true);
    }, 100);
    setGuestSelected(undefined);
  };

  const handleBack = () => {
    setIsModalImport(false);
    setTimeout(() => {
      setVisible(true);
    }, 100);
    setGuestSelected(undefined);
  };

  const handleDelete = () => {
    setPageData(pageData.filter(item => !selectedRowKeys.includes(item.id)));
    setIsModalDelete(false);
  };

  const extendedColumn: any = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      align: 'left',
      type: 'string',
      render: (_text: any, _record: any, index: any) => {
        return (
          <a
            style={{ color: '#1C1917', textDecoration: 'underline' }}
            onClick={() => {
              setGuestSelected(_record);
              setIsModalView(true);
              setTimeout(() => {
                setVisible(false);
              }, 100);
            }}
          >
            {index + 1}
          </a>
        );
      },
    },
    {
      title: 'Guest name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 120,
      align: 'left',
      type: 'string',
      render: (_text: any, _record: any) => _text,
    },
    ...tableColumnsGroup,
    {
      title: 'Phone',
      key: 'phone',
      dataIndex: 'phone',
      width: 120,
      align: 'left',
      type: 'string',
    },
    {
      title: 'ID Type',
      key: 'idType',
      dataIndex: 'idType',
      width: 160,
      align: 'left',
      type: 'string',
      render(value: string, record: any) {
        const matchingIdType = idType.find(
          item => item.value === record?.guest?.idType
        );
        return <div>{matchingIdType ? matchingIdType.label : '-'}</div>;
      },
    },
    ...tableColumns,
    // {
    //   title: 'Active',
    //   key: 'active',
    //   fixed: 'right',
    //   type: 'string',
    //   align: 'center',
    //   width: 116,
    //   render: (item: any, record: any) => (
    //     <div
    //       style={{
    //         display: 'flex',
    //         justifyContent: 'center',
    //         alignItems: 'baseline',
    //       }}>
    //       <ActionButton
    //         icon={<Pen />}
    //         onClick={() => handleEdit(record)}
    //         tooltipTitle="Edit"
    //       />
    //       <ActionButton
    //         tooltipTitle="View"
    //         icon={<EyeOutlined />}
    //         onClick={() => {
    //           setGuestSelected(record);
    //           setModalViewVisible(true);
    //           setTimeout(() => {
    //             setVisible(false);
    //           }, 100);
    //         }}
    //       />
    //       <ActionButton
    //         icon={<Delete />}
    //         tooltipTitle="Delete"
    //         onClick={() => {
    //           setIdGuestSelect(record.id);
    //           setIsModalDelete(true);
    //         }}
    //       />
    //     </div>
    //   ),
    // },
  ];

  const handleOK = () => {
    setData(pageData);
    onOk();
  };

  const onCancelDelete = () => {
    setIdGuestSelect(undefined);
    setIsModalDelete(false);
  };

  const onDeleteMultiple = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one row to delete');
      return;
    }
    setIsModalDelete(true);
  };

  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: RowData[]
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRowData(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <MyModal
      width={880}
      title={title}
      open={isVisible}
      onOk={handleOK}
      onCancel={onCancel}
      footer={
        <>
          <MyButton onClick={onCancel} buttonType="outline">
            Close
          </MyButton>
          <MyButton onClick={handleOK} icon={<Tick />}>
            Save
          </MyButton>
        </>
      }
    >
      <div className="room-sharing-content-wrapper">
        <Flex justify="space-between" className="form-actions">
          <div className="group-actions">
            <Button
              className="custom-btn"
              onClick={showModalImport}
              icon={<Import width={16} height={16} />}
              type="text"
            >
              <span className="btn-text import-text">Import Data</span>
            </Button>
            <div className="divider-form"></div>
            <Button
              type="text"
              onClick={onDeleteMultiple}
              icon={<Delete width={16} height={16} />}
              className="custom-btn"
            >
              <span className="btn-text">Delete</span>
            </Button>
          </div>
        </Flex>
        <TableBasic
          className="custom-table"
          rowKey="id"
          columns={extendedColumn}
          rowSelection={rowSelection}
          tableScrollX={true}
          dataSource={pageData}
          onPaginationChange={handlePaginationChange}
          paginationDetails={paginationDetails}
          bordered
        />
      </div>
      <FormImport
        visible={isModalImport}
        onOk={handleImportOk}
        onCancel={handleCancel}
        onBack={handleBack}
      />
      {guestSelected && (
        <FormAddRoom
          title="View Room Sharing"
          setPageData={setPageData}
          visible={isModalView}
          onOk={() => {}}
          onCancel={handleCancel}
          onBack={handleBack}
          guestData={guestSelected}
          pageData={pageData}
          isView
        />
      )}

      <DeleteModal
        content="Are you sure to delete the record?"
        visible={isModalDelete}
        onOk={() => {
          handleDelete();
        }}
        onCancel={onCancelDelete}
      />
    </MyModal>
  );
};

export default RoomSharingGroup;
