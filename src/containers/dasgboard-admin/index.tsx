import {
  getOverViewAll,
  getOverViewJob,
  getOverViewTransaction,
} from '@/api/features/admin';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
const DashboardAdminContainer: React.FC = () => {
  const [jobs, setJobs] = useState<any>([]);
  const [data, setDatas] = useState<any>([]);
  const [jobCategories, setJobCategories] = useState<any>([]);
  const [transactions, setTransaction] = useState<any>([]);

  const fetchOverViewjob = async () => {
    const res = await getOverViewJob();
    if (res?.result) {
      setJobs(res?.result);
    }
  };
  const fetchOverViewTransactions = async () => {
    const res = await getOverViewTransaction();
    if (res?.result) {
      setTransaction(
        res?.result.map((item: any) => ({
          week: `Tuần ${item.week}`,
          transactions: item.total_transactions,
        }))
      );
    }
  };
  const fetchOverViewAll = async () => {
    const res = await getOverViewAll();
    if (res?.result) {
      setDatas(res?.result);
    }
  };
  useEffect(() => {
    fetchOverViewjob();
    fetchOverViewTransactions();
    fetchOverViewAll();
  }, []);
  useEffect(() => {
    const sorted =
      (jobs &&
        jobs.length > 0 &&
        jobs.sort((a: any, b: any) => b.total_jobs - a.total_jobs)) ||
      [];

    // Mảng màu cho 5 ngành chính
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];

    // Lấy 5 ngành có số lượng lớn nhất
    const top5 = sorted.slice(0, 5).map((item: any, index: number) => ({
      name: item.field_info.name,
      value: item.total_jobs,
      color: colors[index],
    }));

    // Tính tổng các ngành còn lại
    const othersTotal = sorted
      .slice(5)
      .reduce((sum: any, item: any) => sum + item.total_jobs, 0);

    // Thêm mục "Others" nếu có ngành dư
    if (othersTotal > 0) {
      top5.push({
        name: 'Others',
        value: othersTotal,
        color: '#ff0088',
      });
    }

    setJobCategories(top5);
  }, [jobs]);
  useEffect(() => {
    const sorted =
      (jobs &&
        jobs.length > 0 &&
        jobs.sort((a: any, b: any) => b.total_jobs - a.total_jobs)) ||
      [];

    // Mảng màu cho 5 ngành chính
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];

    // Lấy 5 ngành có số lượng lớn nhất
    const top5 = sorted.slice(0, 5).map((item: any, index: number) => ({
      name: item.field_info.name,
      value: item.total_jobs,
      color: colors[index],
    }));

    // Tính tổng các ngành còn lại
    const othersTotal = sorted
      .slice(5)
      .reduce((sum: any, item: any) => sum + item.total_jobs, 0);

    // Thêm mục "Others" nếu có ngành dư
    if (othersTotal > 0) {
      top5.push({
        name: 'Others',
        value: othersTotal,
        color: '#ff0088',
      });
    }

    setJobCategories(top5);
  }, [transactions]);

  const monthlyData = [
    { month: 'T1', transactions: 45, employers: 12, candidates: 89, jobs: 34 },
    { month: 'T2', transactions: 52, employers: 18, candidates: 95, jobs: 41 },
    { month: 'T3', transactions: 48, employers: 15, candidates: 102, jobs: 38 },
    { month: 'T4', transactions: 61, employers: 22, candidates: 118, jobs: 45 },
    { month: 'T5', transactions: 55, employers: 19, candidates: 134, jobs: 52 },
    { month: 'T6', transactions: 67, employers: 25, candidates: 145, jobs: 58 },
  ];
  return (
    <div className="dashboard  m-[20px] ">
      <div className="flex ">
        <div className="w-1/4  ">
          <div className="m-2 h-[140px] rounded-md bg-[linear-gradient(135deg,rgba(59,130,246,0.48),rgba(96,165,250,0.48))]">
            <div className="p-2 text-[16px] font-medium">Tổng giao dịch</div>
            <div className="my-auto text-center text-[30px] font-medium mt-2">
              {data?.transactions}
            </div>
          </div>
        </div>
        <div className="w-1/4  ">
          <div className="m-2 h-[140px] rounded-md bg-[linear-gradient(135deg,rgba(236,72,153,0.48),rgba(244,114,182,0.48))]">
            <div className="p-2 text-[16px] font-medium">Nhà tuyển dụng</div>
            <div className="my-auto text-center text-[30px] font-medium mt-2">
              {data?.employers}
            </div>
          </div>
        </div>
        <div className="w-1/4  ">
          <div className="m-2 h-[140px] rounded-md bg-[linear-gradient(135deg,rgba(253,224,71,0.48),rgba(250,204,21,0.48))]">
            <div className="p-2 text-[16px] font-medium">Ứng viên</div>
            <div className="my-auto text-center text-[30px] font-medium mt-2">
              {data?.candidates}
            </div>
          </div>
        </div>
        <div className="w-1/4  ">
          <div className="m-2 h-[140px] rounded-md bg-[linear-gradient(135deg,rgba(254,215,170,0.48),rgba(253,186,116,0.48))]">
            <div className="p-2 text-[16px] font-medium">Tin đang tuyển</div>
            <div className="my-auto text-center text-[30px] font-medium mt-2">
              {data?.jobs}
            </div>
          </div>
        </div>
      </div>
      <div className="m-2 mt-[20px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <Card>
            <div>
              <div className="text-xl mt-2 font-medium">Phân bố ngành nghề</div>
              <div className="text-base mb-2">
                Tỷ lệ tin tuyển dụng theo ngành
              </div>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={380}>
                <PieChart>
                  <Pie
                    data={jobCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={160}
                    fill="#8884d8"
                    dataKey="value">
                    {jobCategories.map((entry: any, index: any) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Area Chart */}
          <Card>
            <div>
              <div className="text-xl mt-2 font-medium">
                Doanh thu theo tuần
              </div>
              <div className="text-base mb-2">Biểu đồ vùng doanh thu</div>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={380}>
                <AreaChart data={transactions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="transactions"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdminContainer;
