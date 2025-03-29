
import { MyFormItem } from '@/components/basic/form-item'
import { MyInputWithSuffix } from '@/components/basic/input'
import React, { useState } from 'react'
interface IProps{
  disabled?: boolean
  name: string,
  label: string
}
const InputBasicWithSuffix = (props: IProps) => {
  const { disabled =false, name,label } = props;
  return (
    <MyFormItem name={name} label={label} disabled = {disabled}>
      <MyInputWithSuffix
          placeholder="Enter"
        />
    </MyFormItem>
  )
}

export default InputBasicWithSuffix
