import { Image } from 'antd';
import React, { useState } from 'react';

interface IProps {
  value?: string;
  onChange?: string;
}

const ViewImage = (props: IProps) => {
  const { value } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      style={{
        width: '322px',
        height: '100px',
        borderRadius: '8px',
        border: '1px dashed #D6D3D1',
        overflow: 'hidden',
        position: 'relative',
      }}>
      {!isLoaded && (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}
      <Image
        src={`${import.meta.env.VITE_BASE_URL}/api/cms/assets/${value}`}
        alt="view image"
        onLoad={handleImageLoad}
        // style={{
        //   objectFit: 'contain',
        //   width: '100%',
        //   height: '100%',
        //   borderRadius: '8px',
        //   opacity: isLoaded ? 1 : 0,
        //   transition: 'opacity 0.5s ease-in-out',
        // }}
      />
    </div>
  );
};

export default ViewImage;
