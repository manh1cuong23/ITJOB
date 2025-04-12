import React, { useEffect, useState } from 'react';
import { Select, Typography, Row, Col, Card, DatePicker } from 'antd';
import {
  MultiSelectWithSearch,
  SingleSelectSearchCustom,
} from '@/components/basic/select';
import { MyButton } from '@/components/basic/button';
import { Option } from '@/components/basic/select/SingleSelectSearchCustom';
import { FilterOutlined } from '@ant-design/icons';
import { cities, experienceLevels, jobTypes, levels } from '@/constants/job';
import { getListFields } from '@/api/features/other';
import { MyFormItem } from '@/components/basic/form-item';
const option: Option[] = [
  { label: 'Ha Noi1', value: '1' },
  { label: 'Ha Noi2', value: '2' },
  { label: 'Ha Noi3', value: '3' },
  { label: 'Ha Noi4', value: '4' },
];
const FilterSearchDashBoard: React.FC = () => {
  const [fields, setFields] = useState([]);

  // const fetchFields = async () => {
  //   const res = await getListFields();
  //   if (res && res.result) {
  //     const fieldsOptions = res.result.map((item: any) => ({
  //       label: item.name,
  //       value: item.name,
  //     }));
  //     console.log('check ', fieldsOptions);
  //     setFields(fieldsOptions);
  //   }
  // };

  // useEffect(() => {
  //   fetchFields();
  // }, []);
  return (
    <div>
      <div className="my-3 flex justify-between  gap-[16px] ">
        <MyFormItem name="city" isShowLabel={false}>
          <MultiSelectWithSearch
            placeholder="Thành phố"
            // className="cus"
            classButon="!h-[50px] min-w-[260px]"
            options={cities}
          />
        </MyFormItem>
        <MyFormItem name="level">
          <MultiSelectWithSearch
            placeholder="Cấp bậc"
            // className="cus"
            classButon="!h-[50px] min-w-[260px]"
            options={levels}
          />
        </MyFormItem>
        <MyFormItem name="type_work">
          <MultiSelectWithSearch
            placeholder="Loại công việc"
            classButon="!h-[50px] min-w-[260px]"
            options={jobTypes}
          />
        </MyFormItem>
        <MyFormItem name="year_experience">
          <MultiSelectWithSearch
            placeholder="Kinh nghiệm"
            classButon="!h-[50px] min-w-[260px] "
            options={experienceLevels}
          />
        </MyFormItem>
        <MyButton
          buttonType="secondary"
          className="!h-[50px] !w-[140px] !text-8xl !bg-gray"
          icon={<FilterOutlined className="!text-[16px]" />}>
          <p className="!text-[16px]">Xóa bộ lọc</p>
        </MyButton>
      </div>
    </div>
  );
};

export default FilterSearchDashBoard;
