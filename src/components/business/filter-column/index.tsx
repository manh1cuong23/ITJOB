import React, { FC, useState, useEffect } from 'react';
import { Checkbox, Divider, Space } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

interface FilterColumnProps {
  options: { label: string | React.ReactNode; value: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const FilterColumn: FC<FilterColumnProps> = ({
  options,
  selectedValues,
  onChange,
}) => {
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    const allSelected = options.every(option =>
      selectedValues.includes(option.value)
    );
    setSelectAllChecked(allSelected);
  }, [selectedValues, options]);

  const handleChange = (checkedValues: any) => {
    onChange(checkedValues as string[]);
  };

  const handleSelectAll = (e: CheckboxChangeEvent) => {
    const { checked } = e.target;
    const allValues = checked ? options.map(option => option.value) : [];
    onChange(allValues);
  };

  return (
    <div>
      <div
        className="column-select-modal"
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          paddingBottom: '10px',
          paddingLeft: '20px',
          paddingRight: '20px',
          zIndex: 99999,
          maxHeight: '230px',
          overflowY: 'auto',
          marginTop: '2px',
          right: '24px',
        }}>
         <h3>
            Lựa chọn cột
          </h3>
        <div className="column-select-content">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
            <Checkbox
              onChange={handleSelectAll}
              checked={selectAllChecked}
              indeterminate={selectedValues.length > 0 && !selectAllChecked}>
              Chọn tất cả
            </Checkbox>
            <Divider style={{ margin: '0 0' }} />
            <Checkbox.Group value={selectedValues} onChange={handleChange}>
              <Space direction="vertical">
                {options.map(option => (
                  <Checkbox key={option.value} value={option.value}>
                    {typeof option.label === 'string'
                      ? option.label
                      : option.label}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterColumn;
