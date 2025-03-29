import { MyFormItem } from '@/components/basic/form-item'
import { MyRadio } from '@/components/basic/radio'
import { ISource } from '@/utils/formatSelectSource'
import React from 'react'

interface IProps{
    disabled?: boolean;
    options?: ISource[];
    loading: boolean;
    name?: string;
  }
const RadiosStatus = (props: IProps) => {
    const { disabled =false,options , loading = false, name = 'status' } = props;
    const optionsValue = [
        {
            label: 'Active',
            value: 'published'
        },
        {
            label: 'InActive',
            value: 'draft'
        }
    ]
  return (
    <MyFormItem name={name} label="Status" disabled = {disabled}>
        <MyRadio options={options || optionsValue} loading ={loading}/>
    </MyFormItem>
  )
}

export default RadiosStatus
