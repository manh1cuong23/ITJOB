import { KeyLabel } from '@/interface/common/type';
import { Button, Modal, Space, Transfer } from 'antd';
import React, { useMemo, useState } from 'react';
import { Checkbox, Divider } from 'antd';
import { CSVLink } from 'react-csv';
import { CiLogin } from 'react-icons/ci';
import { useMediaQuery } from 'react-responsive';
const CheckboxGroup = Checkbox.Group;
import { pick } from 'lodash';
import { css } from '@emotion/react';

interface ExportExcelOptionModalProps {
  open: boolean;
  header: { key: string; label: string }[];
  csvData: {
    [key: string]: string;
  }[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ExportExcelOptionModal(props: ExportExcelOptionModalProps) {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const { open, setOpen, header, csvData } = props;

  const dataTranfer = header.map(item => ({
    value: item.key,
    label: item.label,
  }));

  const defaultCheckedList = dataTranfer.map(item => item.value);
  const [targetKeys, setTargetKeys] = useState<any>(defaultCheckedList);

  const [checkAll, setCheckAll] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);

  const onChange = (list: any) => {
    setTargetKeys(list);
    setIndeterminate(!!list.length && list.length < dataTranfer.length);
    setCheckAll(list.length === dataTranfer.length);
    console.log('Checked values: ', list);
  };

  const onCheckAllChange = (e: any) => {
    setTargetKeys(e.target.checked ? defaultCheckedList : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    console.log('Checked values: ', e.target.checked ? defaultCheckedList : []);
  };

  const targetCsv = useMemo(() => {
    if (targetKeys.length > 0) {
      return csvData.map(item => {
        return pick(item, targetKeys);
      });
    } else {
      return csvData;
    }
  }, [targetKeys]);
  const targerHeader = useMemo(() => {
    if (targetKeys.length > 0) {
      return header.filter(item => targetKeys.includes(item.key));
    } else {
      return header;
    }
  }, [targetKeys]);

  const handleClose = () => {
    setIndeterminate(false);
    setCheckAll(true);
    setTargetKeys(defaultCheckedList);
    setOpen(false);
  };

  return (
    <div>
      <Modal
        open={open}
        width={'400px'}
        title="Tùy chọn cột để xuất excel"
        onOk={handleClose}
        onCancel={handleClose}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CSVLink
              headers={targerHeader}
              filename="data.csv"
              data={targetCsv}>
              <Button
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
            </CSVLink>
            <Button
              onClick={handleClose}
              style={{
                display: 'flex',
                marginLeft: '10px',
                alignItems: 'center',
                padding: isMobile ? '5px' : '10px',
              }}>
              <span style={{ fontSize: '14px' }}> Đóng</span>
            </Button>
          </div>
        }>
        <div>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}>
            Chọn tất cả
          </Checkbox>
        </div>

        <CheckboxGroup
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '20px',
          }}
          options={dataTranfer}
          value={targetKeys}
          onChange={onChange}
        />

        {/* <Transfer
            style={{ width: '1000px' }}
            dataSource={dataTranfer}
            titles={['Chưa chọn', 'Đã chọn']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={onChange}
            onSelectChange={onSelectChange}
            render={item => item.title}
          /> */}
      </Modal>
    </div>
  );
}

export default ExportExcelOptionModal;
