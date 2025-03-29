import React from 'react';
import NotFoundImage from '@/assets/icons/ic_not_found.svg';
import { MyButton } from '@/components/basic/button';
interface IProps {
    onClearFilter?: () => void;
}
const SharedTableNotFoundData = (props: IProps) => {
  const { onClearFilter } = props;
  return (
    <div style={{ textAlign: 'center', padding: '20px' }} className="not-found">
      <div className="not-found-content">
        <img
          src={NotFoundImage}
          alt="Not Found"
          style={{ width: '100px', marginBottom: '16px' }}
        />
        <p
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#000',
          }}>
          No data found
        </p>
        <p style={{ color: '#000', marginBottom: '0px' }}>
          Re-enter your search data or reload the table.
        </p>
        <p style={{ color: '#000', marginBottom: '15px', marginTop:0 }}>
          Please try again.
        </p>
        <MyButton buttonType="secondary" onClick={onClearFilter}>
          Clear search
        </MyButton>
      </div>
    </div>
  );
};

export default SharedTableNotFoundData;
