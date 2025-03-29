import { apiBookingGuestSearch } from '@/api/features/booking';
import { MyFormItem } from '@/components/basic/form-item';
import { InputAutoComplete } from '@/components/basic/input';
import DebounceSelect from '@/components/basic/select/DebounceSelect';
import { ISource } from '@/utils/formatSelectSource';
import { Form } from 'antd';
import { FormInstance } from 'antd/lib';
import React, { useState } from 'react';
interface IProps {
  name?: string;
  value?: any;
  onChange?: (value: any) => void;
  onSelect?: (selectedItem: ISource) => void;
  tabIndex?: number;
  form?: FormInstance;
  disabled?: boolean;
}
const SelectGuestName = (props: IProps) => {
  const {
    onChange,
    name = 'guestName',
    onSelect,
    tabIndex,
    form,
    disabled = false,
  } = props;
  const fetchUGuestNameList = async (
    search: string,
    pageNum: number
  ): Promise<any> => {
    try {
      const response = await apiBookingGuestSearch(search.trim(), pageNum);
      return {
        options: response.data.map((guest: any) => ({
          label: `${guest.fullName} - ${guest?.phone}`,
          value: guest.id,
        })),
        data: response.data,
        pageCount: response.pagination.pageCount,
      };
    } catch (error) {
      console.error('Error fetching guest names:', error);
      return []; // Trả về mảng rỗng trong trường hợp lỗi
    }
  };

  const handleBlur = async () => {
    await form?.validateFields([name]);
  };

  return (
    <MyFormItem
      name={name}
      required
      label="Guest Name"
      form={form}
      disabled={disabled}>
      <InputAutoComplete
        fetchSuggestions={fetchUGuestNameList}
        onChange={onChange}
        //value={value}
        className="select-guest-name"
        onSelect={onSelect}
        tabIndex={tabIndex}
        onBlur={handleBlur}
      />
    </MyFormItem>
  );
};

export default SelectGuestName;
