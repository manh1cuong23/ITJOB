import React from 'react';
import { Input, Checkbox } from 'antd';
import { MyButton } from '@/components/basic/button';
import { ReactComponent as AddSvg } from '@/assets/icons/ic_add.svg';
import { ReactComponent as SearchSvg } from '@/assets/icons/ic_search.svg';

interface AddSpecialServiceProps {
  services: { key: string; SpecialService: string }[];
  selectedServices: { [key: string]: boolean };
  onServiceChange: (service: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  allChecked: boolean;
  isIndeterminate: boolean;
  onAddService: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onCancel: () => void;
}

const AddSpecialService: React.FC<AddSpecialServiceProps> = ({
  services,
  selectedServices,
  onServiceChange,
  onSelectAll,
  allChecked,
  isIndeterminate,
  onAddService,
  searchTerm,
  setSearchTerm,
  onCancel,
}) => {
  const filteredServices = services.filter(service =>
    service.SpecialService.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Input
        placeholder="Search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: '10px' }}
        suffix={<SearchSvg />}
      />
      <label
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '10px',
          marginBottom: '10px',
          borderBottom: '1px solid #D6D3D1',
           cursor: 'pointer'
        }}>
        <span>Select All</span>
        <Checkbox
          onChange={e => onSelectAll(e.target.checked)}
          checked={allChecked}
          indeterminate={isIndeterminate}
        />
      </label>
      {filteredServices.map(service => (
        <label 
          key={service.key}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            cursor: 'pointer'
          }}>
          <span>{service.SpecialService}</span>
          <Checkbox
            onChange={e => onServiceChange(service.key, e.target.checked)}
            checked={!!selectedServices[service.key]}
          />
        </label>
      ))}
      <div
        style={{
          marginTop: '10px',
          display: 'flex',
          justifyContent: 'flex-end',
          borderTop: '1px solid #D6D3D1',
          paddingTop: '10px',
        }}>
        <MyButton onClick={onCancel} buttonType="outline">
          Cancel
        </MyButton>
        <MyButton
          type="primary"
          onClick={onAddService}
          icon={<AddSvg width={14} height={14} className="ic-white" />}>
          Add
        </MyButton>
      </div>
    </>
  );
};

export default AddSpecialService;
