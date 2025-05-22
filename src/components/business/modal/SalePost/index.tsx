import React, { useEffect, useState } from 'react';
import { MyButton } from '@/components/basic/button';
import { MyModal } from '@/components/basic/modal';
import { getListPackage } from '@/api/features/package';
import { formatCurrency } from '@/utils/helper';
import { createPayOs } from '@/api/features/pay';

const SalePost = ({ open, onFinish, onCancel, title, children }: any) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    // Giả lập API call
    const response = await getListPackage();
    if (response.result) {
      setPackages(response.result);
    }
  };
  useEffect(() => {
    fetchPackages();
  }, [open]);

  const handleOk = async (force = false) => {
    onFinish && onFinish();
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const getColorScheme = (index: any) => {
    const schemes = [
      { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', text: 'text-blue-600' },
      {
        bg: 'bg-orange-500',
        hover: 'hover:bg-orange-600',
        text: 'text-orange-500',
      },
      {
        bg: 'bg-green-500',
        hover: 'hover:bg-green-600',
        text: 'text-green-600',
      },
    ];
    return schemes[index % schemes.length];
  };
  const handleBuy = async (data: any) => {
    const res = await createPayOs({ price: data?.price, idPackage: data?._id });
    if (res?.checkoutUrl) {
      if (res?.checkoutUrl) {
        window.open(res.checkoutUrl, '_blank'); // 👈 Mở trong tab mới
      }
    }
  };

  return (
    <MyModal
      width={1000}
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <>
          <MyButton onClick={handleCancel} buttonType="outline">
            Hủy bỏ
          </MyButton>
          <MyButton onClick={() => handleOk(false)}>Xác nhận</MyButton>
        </>
      }>
      <div className="">
        <div className="flex flex-wrap gap-6 p-4 justify-center">
          {packages.map((pkg: any, index) => {
            const { bg, hover, text } = getColorScheme(index);
            return (
              <div
                key={index}
                className="bg-white shadow-lg rounded-2xl p-6 text-center border border-gray-200 w-full ">
                <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-2">
                  {pkg.count} lượt đăng tuyển
                </p>
                <p className={`text-2xl font-bold ${text} mb-4`}>
                  {formatCurrency(pkg.price)}
                </p>
                <button
                  onClick={() => handleBuy(pkg)}
                  className={`${bg} ${hover} text-white font-medium py-2 px-4 rounded-xl transition duration-200`}>
                  Mua ngay
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </MyModal>
  );
};

export default SalePost;
