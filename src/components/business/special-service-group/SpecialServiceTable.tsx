/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { ReactComponent as DeleteSvg } from '@/assets/icons/ic-delete.svg';
import { ReactComponent as InforSvg } from '@/assets/icons/ic_infor.svg';
import './SpecialService.less';
import dayjs, { Dayjs } from 'dayjs';
import { IndividualListItem } from '../individual-list/IndividualList.types';
import { TableWithRowTotal } from '@/components/basic/table';
import { ISpecialServiceList } from '../special-service/type';
import DeleteModal from '@/components/business/modal/shared-delete-confirm/SharedDeleteConfirm';
import { SpecialServiceColumns } from './SpecialService.columns';
import { IError } from '../booking-info/type';
import { message } from 'antd';

interface IProps {
  arrDeptDate?: [string, string] | null;
  dataSource: ISpecialServiceList[];
  setSpecialSvcAmt?: React.Dispatch<React.SetStateAction<number>>;
  setDataSource: React.Dispatch<React.SetStateAction<ISpecialServiceList[]>>;
  setIndividualList?: React.Dispatch<
    React.SetStateAction<IndividualListItem[]>
  >;
  individualList?: IndividualListItem[];
  messageError?: IError[];
  isModalOpen?: boolean;
}
interface SortState {
  field: string;
  direction: 'ascend' | 'descend' | null;
}

const SpecialServiceTable = (props: IProps) => {
  const {
    dataSource,
    setDataSource,
    arrDeptDate,
    setSpecialSvcAmt,
    isModalOpen = false,
    messageError,
    individualList,
  } = props;
  const [popoverVisible, setPopoverVisible] = useState<number | null>(null);
  const [mainTableSelectedRowKeys, setMainTableSelectedRowKeys] = useState<
    React.Key[]
  >([]);
  const [isGrouped, setIsGrouped] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [sortState, setSortState] = useState<SortState>({
    field: '',
    direction: null,
  });
  const [remarkValue, setRemarkValue] = useState<string | null>(null);

  const handleSort = (field: string) => {
    setSortState(prev => ({
      field,
      direction:
        prev.field !== field
          ? 'ascend'
          : prev.direction === null
          ? 'ascend'
          : prev.direction === 'ascend'
          ? 'descend'
          : null,
    }));
  };

  const sortDataSource = (data: ISpecialServiceList[]) => {
    if (!sortState.field || !sortState.direction) {
      return data;
    }

    const sortMultiplier = sortState.direction === 'ascend' ? 1 : -1;

    return [...data].sort((a, b) => {
      if (sortState.field === 'roomNo') {
        if (!a.roomNo && !b.roomNo) return 0;
        if (!a.roomNo) return 1 * sortMultiplier;
        if (!b.roomNo) return -1 * sortMultiplier;

        const roomNoCompare = a.roomNo.localeCompare(b.roomNo) * sortMultiplier;

        if (roomNoCompare === 0) {
          const serviceCompare = a.serviceCode.localeCompare(b.serviceCode);
          return serviceCompare !== 0
            ? serviceCompare
            : a.serviceName.localeCompare(b.serviceName);
        }
        return roomNoCompare;
      }
      return 0;
    });
  };

  const toggleGroup = () => {
    setIsGrouped(!isGrouped);
  };

  function parseDate(
    date: string | [string, string]
  ): {
    fromDate: Date;
    toDate: Date;
  } {
    if (Array.isArray(date)) {
      const fromDate = dayjs(date[0], 'YYYY-MM-DD').toDate();
      const toDate = dayjs(date[1], 'YYYY-MM-DD').toDate();
      return { fromDate, toDate };
    } else {
      const parsedDate = dayjs(date, 'YYYY-MM-DD').toDate();
      return { fromDate: parsedDate, toDate: parsedDate }; // trường hợp chỉ có 1 ngày
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      setMainTableSelectedRowKeys([]);
    }
  }, [isModalOpen]);

  const handleSave = (row: any) => {
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.id === item.id);
    const item = newData[index];
    const { fromDate, toDate } = parseDate([row.fromDate, row.toDate]);
    // Tính toán lại totalAmount
    const dayDifference =
      Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) +
      1;
    const totalAmount = row.quantity * row.price * dayDifference;

    newData.splice(index, 1, {
      ...item,
      ...row,
      totalAmount: totalAmount,
    });
    setDataSource(newData);
  };
  const handleQuantityChange = (
    record: any,
    change: number,
    max: number = 1000
  ) => {
    const newQuantity = record.quantity + change;
    if (newQuantity >= 1 && newQuantity <= max) {
      handleSave({ ...record, quantity: newQuantity });
    }
  };
  const handleRemarkChange = (record: any, value: string) => {
    handleSave({ ...record, remark: value });
    setPopoverVisible(null);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    record: any
  ) => {
    if (e.key === 'Enter' && e.altKey) {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const cursorPosition = textarea.selectionStart;

      const newValue =
        textarea.value.slice(0, cursorPosition) +
        '\n' +
        textarea.value.slice(cursorPosition);

      textarea.value = newValue;
      textarea.setSelectionRange(cursorPosition + 1, cursorPosition + 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleRemarkChange(record, (e.target as HTMLTextAreaElement).value);
    }
  };

  const onCancelDelete = () => {
    setIsModalDelete(false);
  };

  const hasRestrictedRoomNo = (record: any) => {
    const restrictedRoomNos = new Set(
      individualList &&
        individualList
          .filter(
            individual =>
              individual.bookingStatus === 1 || individual.bookingStatus === 3
          )
          .map(individual => individual.roomNo)
    );

    return restrictedRoomNos.has(record.roomNo || '');
  };

  const columns: any = SpecialServiceColumns({
    handleSave,
    handleQuantityChange,
    handleRemarkChange,
    handleKeyPress,
    arrDeptDate,
    popoverVisible,
    setPopoverVisible,
    isGrouped,
    toggleGroup,
    messageError,
    sortState,
    onSort: handleSort,
    setRemarkValue,
    remarkValue,
    hasRestrictedRoomNo,
  });

  const totalSum = dataSource
    .filter(item => item.totalAmount != null && !isNaN(item.totalAmount))
    .reduce((sum, item) => sum + item.totalAmount, 0);

  useEffect(() => {
    totalSum && setSpecialSvcAmt && setSpecialSvcAmt(totalSum);
  }, [totalSum]);

  const handleRemoveSpecialService = () => {
    let itemsToDelete = new Set(mainTableSelectedRowKeys);

    if (isGrouped) {
      mainTableSelectedRowKeys.forEach(key => {
        const groupedItem = displayedDataSource.find(
          item => item.id === key && item.children
        );
        if (groupedItem && groupedItem.children) {
          groupedItem.children.forEach((child: any) =>
            itemsToDelete.add(child.id)
          );
        }
      });
    }

    const newDataSource = dataSource.filter(
      item => !itemsToDelete.has(item.id)
    );
    setDataSource(newDataSource);
    setMainTableSelectedRowKeys([]);
    setIsModalDelete(false);
  };

  const mainTableRowSelection = {
    selectedRowKeys: mainTableSelectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setMainTableSelectedRowKeys(selectedRowKeys);
    },
  };

  const getGroupedDataSource = (dataSource: ISpecialServiceList[]) => {
    const countMap: Record<string, number> = dataSource.reduce((acc, item) => {
      const key = `${item.serviceCode} - ${item.serviceName}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const grouped = dataSource.reduce((acc, item) => {
      const key = `${item.serviceCode} - ${item.serviceName}`;

      if (countMap[key] > 1) {
        if (!acc[key]) {
          acc[key] = {
            id: key,
            serviceCode: item.serviceCode,
            serviceName: item.serviceName,
            quantity: '',
            price: '',
            fromDate: '-',
            toDate: '-',
            totalAmount: '',
            remark: '',
            children: [],
            childIds: [],
          };
        }
        acc[key].children.push(item);
        acc[key].childIds.push(item.id);
      } else {
        acc[key] = acc[key] || [];
        acc[key].push(item);
      }
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped).flat();
  };

  const displayedDataSource = React.useMemo(() => {
    const baseData = dataSource;
    if (isGrouped) {
      return getGroupedDataSource(baseData);
    } else {
      return sortState.field ? sortDataSource(baseData) : baseData;
    }
  }, [dataSource, isGrouped, sortState]);

  const errorMessages = Array.from(
    new Set(messageError?.map(error => error.field))
  ).join(', ');

  const handleDeleteClick = () => {
    if (!dataSource) return;

    const restrictedRoomNos = new Set(
      individualList &&
        individualList
          .filter(
            individual =>
              individual.bookingStatus === 1 || individual.bookingStatus === 3
          )
          .map(individual => individual.roomNo)
    );

    const invalidItems = dataSource.filter(
      item => item.roomNo && restrictedRoomNos.has(item.roomNo)
    );

    const hasInvalidSelection = invalidItems.some(item =>
      mainTableSelectedRowKeys.includes(item.id)
    );

    if (hasInvalidSelection) {
      message.error('Cannot delete items');
      return;
    }

    setIsModalDelete(true);
  };

  return (
    <>
      <div className="action space-between">
        <div
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={event => {
            event.stopPropagation();
            handleDeleteClick();
          }}
        >
          <DeleteSvg />
          <span style={{ marginLeft: '5px' }}>Delete</span>
        </div>
      </div>
      <TableWithRowTotal
        dataSource={displayedDataSource}
        columns={columns}
        total={totalSum}
        rowSelection={mainTableRowSelection}
        rowKey="id"
      />
      {errorMessages && (
        <div
          style={{
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '5px',
          }}
        >
          <InforSvg width={15} height={15} className="icon-infor-error" />
          {messageError?.[0]?.message
            ? messageError?.[0]?.message
            : `${errorMessages} are required for each day!`}
        </div>
      )}
      <DeleteModal
        content="Are you sure to delete the record(s)?"
        visible={isModalDelete}
        onOk={handleRemoveSpecialService}
        onCancel={onCancelDelete}
      />
    </>
  );
};
export default SpecialServiceTable;
