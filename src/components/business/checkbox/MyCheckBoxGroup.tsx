import React, { useEffect, useState } from 'react';
import { Checkbox, Divider, Skeleton } from 'antd';
import type { CheckboxProps } from 'antd';
import './style.less';

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['Apple', 'Pear', 'Orange'];

interface IProps {
  onChange?: (e: any) => void;
  loading?: boolean;
  defaultValue?: string[];
  options: string[];
}

const MyCheckBoxGroup = (props: IProps) => {
  const { loading = false, defaultValue, options } = props;
  const [checkedList, setCheckedList] = useState<string[]>(defaultValue || []);
  const [showSkeleton, setShowSkeleton] = useState(loading);

  const checkAll = options.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < options.length;

  const onChange = (list: string[]) => {
    setCheckedList(list);
  };

  const onCheckAllChange: CheckboxProps['onChange'] = e => {
    setCheckedList(e.target.checked ? options : []);
  };

  useEffect(() => {
    if (defaultValue) {
      setCheckedList(defaultValue);
    } else {
      setCheckedList([]);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (loading) {
      setShowSkeleton(true);
    } else {
      const timeout = setTimeout(() => {
        setShowSkeleton(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  return (
    <div className="my-checkbox-container">
      <Skeleton.Input
        active
        size="small"
        className="my-skeleton-input"
        style={{
          opacity: showSkeleton ? 1 : 0,
        }}
      />
      <div
        className="my-checkbox"
        style={{
          opacity: showSkeleton ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          All
        </Checkbox>
        <Divider type="vertical" />
        <CheckboxGroup
          options={options}
          value={checkedList}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default MyCheckBoxGroup;
