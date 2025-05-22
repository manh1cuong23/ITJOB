import React, { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import { ReactComponent as ArrowDown } from '@/assets/icons/ic_arrow_down.svg';
import { ReactComponent as ArrowUp } from '@/assets/icons/ic_arrow_up.svg';

interface IProps {
  getItems: (value: any) => any;
  activeKey?: string | string[];
  onChange?: (key: string | string[]) => void;
  accordion?: boolean;
  className?: string;
}

const MyCollapse = (props: IProps) => {
  const { getItems, activeKey = ['1'], onChange, accordion = true } = props;
  const [expandedKeys, setExpandedKeys] = useState<string | string[]>(
    activeKey
  );
  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: '#F5F5F4',
    borderRadius: '8px',
    border: 'none',
  };

  useEffect(() => {
    setExpandedKeys(activeKey);
  }, [activeKey]);

  const handleIconClick = (key: string) => {
    setExpandedKeys((prevKeys: any) => {
      return prevKeys.includes(key)
        ? prevKeys?.filter((k: any) => k !== key)
        : [...prevKeys, key];
    });
    if (onChange) onChange(expandedKeys.includes(key) ? [] : [key]);
  };

  const expandIcon = (panelProps: any) => {
    const isOpen = expandedKeys.includes(panelProps.panelKey);
    return (
      <span
        onClick={e => {
          e.stopPropagation(); // Ngăn không cho header nhận sự kiện
          handleIconClick(panelProps.panelKey); // Gọi hàm khi click vào icon
        }}
        style={{
          padding: '10px',
          cursor: 'pointer',
        }}>
        {isOpen ? <ArrowDown /> : <ArrowUp />}
      </span>
    );
  };

  return (
    <Collapse
      bordered={false}
      defaultActiveKey={['1']}
      activeKey={expandedKeys}
      onChange={onChange}
      items={getItems(panelStyle)}
      expandIconPosition="end"
      expandIcon={expandIcon}
      accordion={accordion}
      className="custom-collapse"
    />
  );
};

export default MyCollapse;
