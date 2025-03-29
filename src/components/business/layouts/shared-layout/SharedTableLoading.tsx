import React, { useEffect, useState } from 'react';
import LoadingSvg from '@/assets/icons/ic_loading.svg';
import { MyButton } from '@/components/basic/button';
import { Progress } from 'antd';
interface IProps {
  progress?: number;
}
const SharedTableLoading = (props: IProps) => {
  const { progress } = props;
  return (
    <div style={{ textAlign: 'center', padding: '20px', borderRadius:'16px' }} className="not-found">
      <div className="not-found-content">
        <img
          src={LoadingSvg}
          alt="loading"
        />
        <p
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#000',
          }}>
          Loading system data
        </p>
        <Progress
          percent={progress}
          strokeColor="#1C1917"
          showInfo={false}
          style={{ width: '80%', height: '4px', borderRadius: '100px' }}
        />
        <p style={{ color: '#000', marginBottom: '0px', fontSize: '11px' }}>
          This take a few seconds
        </p>
      </div>
    </div>
  );
};

export default SharedTableLoading;
