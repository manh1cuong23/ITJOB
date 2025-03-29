import { Button } from 'antd';
import React, { useRef } from 'react';
import { CiLogin } from 'react-icons/ci';
import Papa from 'papaparse';
import { useMediaQuery } from 'react-responsive';

interface IImportExcelProps {
  style?: React.CSSProperties;
  keyMapping: KeyMapping[];
}
interface KeyMapping {
  key: string;
  label: string;
}

interface DataMap {
  [key: string]: string;
}

function ImportExcel(props: IImportExcelProps) {
  const { style, keyMapping } = props;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isMobile2 = useMediaQuery({ maxWidth: 555 });

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: results => {
          console.log(results.data);
          console.log(mapTransactionKeys(results.data as DataMap[]));
        },
      });
    }
  };

  const mapTransactionKeys = (dataMap: DataMap[]): DataMap[] => {
    return dataMap.map(dataMap => {
      const mappedData: DataMap = {};
      keyMapping.forEach(mapping => {
        if (dataMap[mapping.label]) {
          mappedData[mapping.key] = dataMap[mapping.label];
        }
      });
      return mappedData;
    });
  };

  return null;
  // <div style={style}>
  //   <input
  //     type="file"
  //     ref={fileInputRef}
  //     style={{
  //       display: 'none',
  //     }}
  //     onChange={handleFileChange}
  //     accept=".xlsx, .xls, .csv"
  //   />
  //   <Button
  //     onClick={handleButtonClick}
  //     style={{
  //       display: 'flex',
  //       alignItems: 'center',
  //       padding: isMobile2? '5px':'10px',
  //     }}>
  //     <CiLogin
  //       style={{
  //         marginRight: isMobile2? '5px':'10px',
  //         width: '14px',
  //         height: '14px',
  //       }}
  //     />
  //     <span style={{ fontSize: '14px' }}>Nhập excel</span>
  //   </Button>
  // </div>
}

export default ImportExcel;
