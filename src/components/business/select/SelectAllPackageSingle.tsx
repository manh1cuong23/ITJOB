import { getAllPackage } from '@/api/features/package';
import { MyFormItem } from '@/components/basic/form-item';
import { SelectCompact } from '@/components/basic/select';
import { FormInstance } from 'antd';
import React, { useEffect } from 'react';

interface IProps {
  name?: string;
  label?: string;
  hotelId: string;
  required?: boolean;
  form?: FormInstance;
  disabled?: boolean;
}

const SelectAllPackageSingle = ({
  name = 'package',
  label = 'Package',
  hotelId,
  required = false,
  form,
  disabled = false,
}: IProps) => {
  const fetchData = async () => {
    const data = await getAllPackage(hotelId);
    console.log(data);
  };

  useEffect(() => {
    fetchData();
  }, [hotelId]);

  return (
    <MyFormItem
      name={name}
      label={label}
      required={required}
      form={form}
      disabled={disabled}>
      <SelectCompact
        options={[
          {
            label: 'Convention/ Conference/ Trade Show',
            value: 'Convention/ Conference/ Trade Show',
          },
          {
            label: 'Travel Agent individual',
            value: 'Travel Agent individual',
          },
          {
            label: 'Corporate International',
            value: 'Corporate International',
          },
          {
            label: 'Walk-in',
            value: 'Walk-in',
          },
        ]}
      />
    </MyFormItem>
  );
};

export default SelectAllPackageSingle;
