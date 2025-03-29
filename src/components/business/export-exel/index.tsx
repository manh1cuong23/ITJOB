import { Dispatch, SetStateAction } from 'react';
import { CiLogin } from 'react-icons/ci';
import { Button } from 'antd';
import _ from 'lodash';
import { useMediaQuery } from 'react-responsive';
import ExportExcelOptionModal from './modal-options';

interface IExportExcelProps {
  data: {
    [key: string]: any;
  }[];
  header: { key: string; label: string }[];
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
interface InputObject {
  [key: string]: any;
}
interface OutputObject {
  [key: string]: string;
}

function ExportCSV(props: IExportExcelProps) {
  const { data, header, open, setOpen } = props;
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  function flattenObject(
    obj: InputObject,
    parentKey: string = '',
    res: OutputObject = {}
  ): OutputObject {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (
          typeof obj[key] === 'object' &&
          obj[key] !== null &&
          !Array.isArray(obj[key])
        ) {
          flattenObject(obj[key], newKey, res);
        } else {
          res[newKey] = obj[key];
        }
      }
    }
    return res;
  }

  function convertObject(obj: InputObject): OutputObject {
    const flattened = flattenObject(obj);
    const result: OutputObject = {};

    for (let key in flattened) {
      const keys = key.split('.');
      if (keys.length === 2) {
        result[keys[0]] = result[keys[0]]
          ? result[keys[0]] + '\n' + flattened[key]
          : flattened[key];
      } else {
        result[key] = flattened[key];
      }
    }
    return result;
  }

  const formatData = data.map(item => {
    return convertObject(item);
  });
  const csvData = formatData;
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? '5px' : '10px',
        }}>
        <CiLogin
          style={{
            marginRight: isMobile ? '5px' : '10px',
            width: '14px',
            height: '14px',
          }}
        />
        <span style={{ fontSize: '14px' }}> Xuất excel</span>
      </Button>

      <ExportExcelOptionModal
        csvData={formatData}
        header={header}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}

export default ExportCSV;
