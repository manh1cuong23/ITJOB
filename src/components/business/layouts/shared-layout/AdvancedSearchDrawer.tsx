import React, { useEffect, useState } from 'react';
import { Drawer, Button, Form } from 'antd';
import { AdvancedSearchDrawerProps } from './type';
import './style.less';
import { ReloadOutlined , CloseOutlined } from '@ant-design/icons';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as ApplySvg } from '@/assets/icons/ic_apply_check.svg';
const AdvancedSearchDrawer: React.FC<AdvancedSearchDrawerProps> = ({
  visible,
  onClose,
  children,
  onSearch,
  form,
  initialValues,
  setActiveFiltersCount,
}) => {
  useEffect(() => {
    if (initialValues?.initialValueAdvanceSearch) {
      const initialCount = countActiveFilters(initialValues.initialValueAdvanceSearch);
      if (setActiveFiltersCount) {
        setActiveFiltersCount(initialCount);
      }
    }
  }, [initialValues, setActiveFiltersCount]);

  const countActiveFilters = (values: Record<string, any>): number => {
    if (!values) return 0;

    return Object.entries(values).reduce((count, [key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0 ? count + 1 : count;
      } else if (typeof value === 'object' && value !== null) {
        const hasValue = Object.values(value).some(v =>
          v !== null && v !== undefined && v !== ''
        );
        return hasValue ? count + 1 : count;
      } else {
        return value !== null && value !== undefined && value !== '' ? count + 1 : count;
      }
    }, 0);
  };

  const handleApply = async () => {
    try {
      const values = await form.validateFields();
      if (values) {
        const count = countActiveFilters(values);
        if (setActiveFiltersCount) {
          setActiveFiltersCount(count);
        }
        onSearch?.(values);
        onClose();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const onValuesChange = (_changedValues: any, allValues: Record<string, any>) => {
    const count = countActiveFilters(allValues);
    if (setActiveFiltersCount) {
      setActiveFiltersCount(count);
    }
  };

  const handleReset = () => {
    form.resetFields();
    if (setActiveFiltersCount) {
      setActiveFiltersCount(0);
    }
  };

  const CustomTitle = (
    <div className="drawer-header">
      <div className='title'>
      <p style={{paddingTop : '4px'}}>
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M1 0C1.55228 0 2 0.447715 2 1V7C2 7.55228 1.55228 8 1 8C0.447715 8 0 7.55228 0 7V1C0 0.447715 0.447715 0 1 0ZM10.2929 5.29289C10.6834 4.90237 11.3166 4.90237 11.7071 5.29289L15.7071 9.29289C16.0976 9.68342 16.0976 10.3166 15.7071 10.7071L11.7071 14.7071C11.3166 15.0976 10.6834 15.0976 10.2929 14.7071C9.90237 14.3166 9.90237 13.6834 10.2929 13.2929L12.5858 11H4C3.46957 11 2.96086 11.2107 2.58579 11.5858C2.21071 11.9609 2 12.4696 2 13V19C2 19.5523 1.55228 20 1 20C0.447715 20 0 19.5523 0 19V13C0 11.9391 0.421427 10.9217 1.17157 10.1716C1.92172 9.42143 2.93913 9 4 9H12.5858L10.2929 6.70711C9.90237 6.31658 9.90237 5.68342 10.2929 5.29289Z" fill="#354052"/>
          </svg>
      </p>
      <span style={{marginLeft : '14px', fontSize: '18px'}}>Advanced Search</span>
      </div>

      <CloseOutlined
        onClick={onClose}
        className="close-icon"
        style={{width: '16px' , height: '16px' , alignItems: 'center', padding: '4px'}}
      />
    </div>
  );

  return (
    <Drawer
      title={CustomTitle}
      placement="right"
      closable={true}
      onClose={onClose}
      open={visible}
      width={400}

      footer={
        <div className="drawer-footer">
          <Button type='link' onClick={handleReset} style={{ marginRight: 8 }} icon ={<ReloadOutlined/>}>
            Set To Default
          </Button>
          <div>
            <MyButton buttonType={'outline'} onClick={onClose}>Close</MyButton>
            <MyButton
              // icon = {<ApplySvg height={16} width={16}/>}
              onClick={handleApply}
              type="primary">
              Search
            </MyButton>
          </div>
        </div>
      }>
      <Form
      form={form}
      layout="vertical"
      initialValues={initialValues?.initialValueAdvanceSearch}
      onValuesChange={onValuesChange}
      >{children}</Form>
    </Drawer>
  );
};

export default AdvancedSearchDrawer;


