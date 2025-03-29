import './style.less';
import { TableWithAddButtonProps } from './type';
import { message, Popover, Table } from 'antd';
import { ReactComponent as NotFoundSvg } from '@/assets/icons/ic_not_found_select.svg';
import { ReactComponent as SearchSvg } from '@/assets/icons/ic_search.svg';
import { ReactComponent as AddSvg } from '@/assets/icons/ic_add.svg';
import { MyInput } from '../input';
import { useState } from 'react';
import { MyCheckbox } from '../checkbox';
import { MyButton } from '../button';
import { formatNumberMoney, generateUniqueString } from '@/utils/common';
import TableBasic from './TableBasic';

const TableWithRowTotalAndRowAdd = ({
  dataSource,
  columns,
  tableScrollY,
  total,
  filteredData,
  setSpecialServiceData,
  specialServiceList,
  hotelId,
  ...rest
}: TableWithAddButtonProps) => {
  const [visible, setVisible] = useState(false);
  const [popoverSelectedOptions, setPopoverSelectedOptions] = useState<
    string[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDataList = specialServiceList.filter((item: any) =>
    item.serviceCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (value: string) => {
    setPopoverSelectedOptions(prev => {
      const newOptions = prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value];

      return newOptions;
    });
  };

  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      const allOptions = filteredDataList.map((item: any) => item.id);
      setPopoverSelectedOptions(allOptions);
    } else {
      setPopoverSelectedOptions([]);
    }
  };

  const handleAddSpecialService = () => {
    const selectedData = specialServiceList.filter((item: any) =>
      popoverSelectedOptions.includes(item.id)
    );

    const newData = selectedData.map((item: any) => ({
      ...item,
      no: item.id,
      id: generateUniqueString(),
      remark: '',
    }));

    if (newData.length > 0) {
      setSpecialServiceData(prev => [...prev, ...newData]);
    }

    setVisible(false);
    setPopoverSelectedOptions([]);
  };

  const isAllSelected =
    popoverSelectedOptions.length === filteredDataList.length &&
    filteredDataList.length > 0;

  const renderPopoverContent = () => (
    <div style={{ width: 300 }}>
      <MyInput
        placeholder="Enter"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        allowClear
        suffix={!searchTerm && <SearchSvg />}
      />
      <div>
        <label
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '0 10px',
            borderRadius: '6px',
            marginTop: '10px',
            backgroundColor: isAllSelected ? '#FDECF0' : 'transparent',
          }}>
          <span className="pop-label">Select All</span>
          <MyCheckbox onChange={handleSelectAll} checked={isAllSelected} />
        </label>
        <div className="diviver-pop" style={{ margin: '10px 0' }}></div>
        {filteredDataList.length === 0 ? (
          <div
            className="not-found-select"
            style={{ textAlign: 'center', marginTop: 20 }}>
            <NotFoundSvg width={105} height={87} />
            <span>No data found</span>
          </div>
        ) : (
          filteredDataList.map((item: any) => (
            <label
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '0 10px',
                borderRadius: '6px',
                marginBottom: '10px',
                backgroundColor: popoverSelectedOptions.includes(item.id)
                  ? '#FDECF0'
                  : 'transparent',
              }}
              className={`pop-label-wrapp ${
                popoverSelectedOptions.includes(item.id) ? 'selected' : ''
              }`}>
              <span className="pop-label">{`${item.serviceCode} - ${item.serviceName}`}</span>
              <MyCheckbox
                checked={popoverSelectedOptions.includes(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
              />
            </label>
          ))
        )}
      </div>
      <div className="diviver-pop"></div>
      <div
        style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
        <MyButton buttonType="outline" onClick={() => setVisible(false)}>
          Close
        </MyButton>
        <MyButton buttonType="primary" onClick={handleAddSpecialService}>
          Save
        </MyButton>
      </div>
    </div>
  );

  const handlePopoverOpen = (open: boolean) => {
    if (!hotelId || hotelId === 'N/A') {
      message.error('Please select hotel to process');
      return;
    } else {
      setVisible(open);
    }
  };

  return (
    <TableBasic
      className={dataSource.length > 0 ? '' : 'no-data-table'}
      columns={columns}
      dataSource={dataSource}
      tableScrollY={tableScrollY}
      {...rest}
      summary={() => (
        <>
          {dataSource.length > 0 && (
            <Table.Summary.Row className="total-row row-without-border">
              <Table.Summary.Cell index={0} colSpan={columns && columns.length}>
                <span className="total-sum">
                  Total Sum:{' '}
                  {total !== undefined && !isNaN(total)
                    ? formatNumberMoney(total)
                    : ''}
                </span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={1}></Table.Summary.Cell>
            </Table.Summary.Row>
          )}
          <Table.Summary.Row>
            <Table.Summary.Cell
              index={0}
              colSpan={columns && columns.length + 1}>
              <Popover
                content={renderPopoverContent()}
                trigger="click"
                open={visible}
                onOpenChange={handlePopoverOpen}
                overlayClassName="popover-add">
                <MyButton icon={<AddSvg />} className="add-special-btn">
                  Add Special Service
                </MyButton>
              </Popover>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </>
      )}
    />
  );
};

export default TableWithRowTotalAndRowAdd;
