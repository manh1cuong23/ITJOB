import { ColumnsType } from 'antd/es/table';
import { DataType } from '@/components/business/layouts/shared-layout/type';
import { TableProps } from 'antd/lib';
import { TagStatus } from '@/components/business/tags';

export interface DataTypeCoumn {
  id?: number;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
}
const Columns: ColumnsType<DataTypeCoumn> &
  TableProps<DataType<any>>['columns'] = [
  {
    title: 'Username',
    dataIndex: 'userName',
    key: 'userName',
    width: 150,
  },
  {
    title: 'Full Name',
    dataIndex: 'fullName',
    key: 'fullName',
    width: 200,
    render: (status: string, record: any) => {
      return `${record.firstName} ${record.lastName}`;
    },
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 200,
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
    width: 200,
  },
  {
    title: 'Status',
    key: 'isActive',
    dataIndex: 'isActive',
    width: 200,
    render: (status: boolean) => (
      <TagStatus status={status ? 'active' : 'inactive'} />
    ),
  },
];

export default Columns;
