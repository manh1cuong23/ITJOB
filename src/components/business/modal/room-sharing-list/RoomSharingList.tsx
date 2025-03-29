import React, { useState, useEffect } from 'react';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as Tick } from '@/assets/icons/ic_ticks.svg';
import { ReactComponent as Delete } from '@/assets/icons/ic-delete.svg';
import { ReactComponent as AddSvg } from '@/assets/icons/ic_plus_room_sharing.svg';
import { ReactComponent as Import } from '@/assets/icons/ic_import.svg';
import { ReactComponent as Pen } from '@/assets/icons/ic_pen.svg';
import { Flex, Button, message } from 'antd';
import FormAddRoom from '../room-sharing-cru/RoomSharingCRU';
import { tableColumns } from './RoomSharingLitstColumns';
import FormImport from '../room-sharing-import/RoomSharingImport';
import { MyModal } from '@/components/basic/modal';
import './RoomSharingList.less';
import { EyeOutlined } from '@ant-design/icons';
import ActionButton from '../../../basic/table/TableActionButton';
import DeleteModal from '../shared-delete-confirm/SharedDeleteConfirm';
import { TableBasic } from '@/components/basic/table';
import { RowData } from './RoomSharingList.types';
import { ViewRoomSharing } from '../room-sharing-view';
import { useSelector } from 'react-redux';
import { selectIdType } from '@/stores/slices/idType.slice';

const FormRoomSharing: React.FC<{
  firstMount?: boolean;
  setFirstMount?: (firstMount: boolean) => void;
  data: any[];
  setData: (data: any[]) => void;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
  title: string;
  arrDeptDate?: [string, string] | null;
}> = ({
  visible,
  onOk,
  onCancel,
  title,
  data,
  setData,
  firstMount,
  setFirstMount,
  arrDeptDate,
}) => {
  const [titl, setTitl] = useState('');
  const [isModal, setIsModal] = useState(false);
  const [isModalImport, setIsModalImport] = useState(false);
  const [isDetailRoomSharing, setIsDetailRoomSharing] = useState(false);
  const [modalViewVisible, setModalViewVisible] = useState(false);
  const [isVisible, setVisible] = useState(visible);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRowData, setSelectedRowData] = useState<RowData[]>([]);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [noGuestSelect, setNoGuestSelect] = useState<string | undefined>(
    undefined
  );
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [guestSelected, setGuestSelected] = useState<any>(undefined);
  const [pageData, setPageData] = useState<any[]>([]);
  const idType = useSelector(selectIdType);
  const onSelectChange = (
    newSelectedRowKeys: React.Key[],
    selectedRows: RowData[]
  ) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRowData(selectedRows);
  };

  const onDeleteMultiple = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one row to delete');
      return;
    }
    setIsModalDelete(true);
  };

  const handleDeleteMultiple = () => {
    setPageData(pageData.filter(item => !selectedRowKeys.includes(item.No)));
    setSelectedRowKeys([]);
    setSelectedRowData([]);
    setIsModalDelete(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const showModalAdd = () => {
    setIsModal(true);
    setTimeout(() => {
      setVisible(false);
    }, 100);
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

  const handleOk = () => {
    setData(pageData);
    setIsModal(false);
    setTimeout(() => {
      setVisible(true);
    }, 100);
    setGuestSelected(undefined);
  };

  const handleImportOk = () => {
    setIsModalImport(false);
    setTimeout(() => {
      setVisible(true);
    }, 100);
  };

  const handleCancel = () => {
    setIsModal(false);
    setIsModalImport(false);
    setTimeout(() => {
      setVisible(true);
    }, 100);
    setGuestSelected(undefined);
  };

  const handleBack = () => {
    setIsModal(false);
    setIsModalImport(false);
    setTimeout(() => {
      setVisible(true);
    }, 100);
    setGuestSelected(undefined);
  };

  const handleDelete = (No: string) => {
    setPageData(pageData.filter(item => item.No !== No));
    setIsModalDelete(false);
    setNoGuestSelect(undefined);
  };

  const handleEdit = (record: any) => {
    console.log(record);
    setGuestSelected(record);
    showModalAdd();
  };

  const extendedColumn: any = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      align: 'left',
      type: 'string',
      render: (_text: any, _record: any, index: any) => index + 1,
    },
    {
      title: 'Guest name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 150,
      align: 'left',
      type: 'string',
      render: (_text: any, _record: any) => {
        return (
          <a
            style={{ color: '#1C1917', textDecoration: 'underline' }}
            onClick={() => {
              setGuestSelected(_record);
              setModalViewVisible(true);
              setTimeout(() => {
                setVisible(false);
              }, 100);
            }}>
            {_text}
          </a>
        );
      },
    },
    {
      title: 'Phone',
      key: 'phone',
      dataIndex: 'phone',
      width: 120,
      align: 'left',
      type: 'string',
      render: (text: any) => text || '-',
    },
    {
      title: 'ID Type',
      key: 'idType',
      dataIndex: 'idType',
      width: 160,
      align: 'left',
      type: 'string',
      render(value: string, record: any) {
        const matchingIdType = idType.find(item => item.value === value);
        return <div>{matchingIdType ? matchingIdType.label : '-'}</div>;
      },
    },
    ...tableColumns,
    {
      title: 'Actions',
      key: 'active',
      fixed: 'right',
      type: 'string',
      align: 'center',
      width: 116,
      render: (item: any, record: any) => (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
          }}>
          <ActionButton
            icon={<Pen />}
            onClick={() => handleEdit(record)}
            tooltipTitle="Edit"
          />
          <ActionButton
            tooltipTitle="View"
            icon={<EyeOutlined />}
            onClick={() => {
              setGuestSelected(record);
              setModalViewVisible(true);
              setTimeout(() => {
                setVisible(false);
              }, 100);
            }}
          />
          <ActionButton
            icon={<Delete />}
            tooltipTitle="Delete"
            onClick={() => {
              setNoGuestSelect(record.No);
              setIsModalDelete(true);
            }}
          />
        </div>
      ),
    },
  ];

  const handleOK = () => {
    setData(pageData);
    onOk();
  };

  const onCancelDelete = () => {
    setNoGuestSelect(undefined);
    setIsModalDelete(false);
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
      }>
      <div className="room-sharing-content-wrapper">
        <Flex justify="space-between" className="form-actions">
          <div className="group-actions">
            <Button
              className="custom-btn"
              onClick={showModalImport}
              icon={<Import width={16} height={16} />}
              type="text">
              <span className="btn-text import-text">Import Data</span>
            </Button>
            <div className="divider-form"></div>
            <Button
              type="text"
              onClick={onDeleteMultiple}
              icon={<Delete width={16} height={16} />}
              className="custom-btn">
              <span className="btn-text">Delete</span>
            </Button>
          </div>
          <Button
            className="btn-add-new custom-btn"
            onClick={showModalAdd}
            type="text"
            icon={<AddSvg width={16} height={16} />}>
            <span className="btn-title">Add New</span>
          </Button>
        </Flex>
        <TableBasic
          className="custom-table"
          rowKey="No"
          columns={extendedColumn}
          rowSelection={rowSelection}
          dataSource={pageData}
          bordered
        />
      </div>
      <FormAddRoom
        title={guestSelected ? 'Edit Room Sharing' : 'New Room Sharing'}
        setPageData={setPageData}
        visible={isModal}
        onOk={handleOk}
        onCancel={handleCancel}
        onBack={handleBack}
        guestData={guestSelected}
        arrDeptDate={arrDeptDate}
        pageData={pageData}
      />
      <FormImport
        visible={isModalImport}
        onOk={handleImportOk}
        onCancel={handleCancel}
        onBack={handleBack}
      />

      {/* <EditDetailGuest
        idSelected={idGuestSelect}
        setPageData={setPageData}
        title={'Edit Guest'}
        visible={modalEditVisible}
        onOk={() => {
          setModalEditVisible(false);
          setIdGuestSelect(undefined);
        }}
        onCancel={() => {
          setModalEditVisible(false);
          setIdGuestSelect(undefined);
        }}
        onBack={() => {
          setModalEditVisible(false);
          setIdGuestSelect(undefined);
        }}
      /> */}
      {guestSelected && (
        <ViewRoomSharing
          setPageData={setPageData}
          guestSelected={guestSelected}
          visible={modalViewVisible}
          pageData={pageData}
          onCancel={() => {
            setModalViewVisible(false);
            setGuestSelected(undefined);
            setTimeout(() => {
              setVisible(true);
            }, 100);
          }}
          title={'View Room Sharing '}
        />
      )}

      <DeleteModal
        content="Are you sure to delete the record?"
        visible={isModalDelete}
        onOk={() => {
          noGuestSelect ? handleDelete(noGuestSelect) : handleDeleteMultiple();
        }}
        onCancel={onCancelDelete}
      />
    </MyModal>
  );
};

export default FormRoomSharing;
