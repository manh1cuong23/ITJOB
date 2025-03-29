import { MyCard } from '@/components/basic/card';
import './DetailInfo.less';
import MyTextArea from '@/components/basic/input/Textarea';
import { formatNumberMoney } from '@/utils/common';
import { MyCardContent } from '@/components/basic/card-content';
import { ReactComponent as InforSvg } from '@/assets/icons/ic_infor.svg';
import { message, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Voucher } from '../modal/voucher';
import { IError } from '../booking-info/type';
import { IndividualListItem } from '../individual-list/IndividualList.types';
interface IProps {
  totalRoomCharge?: number;
  specialSvcAmt?: number;
  deposit?: number;
  amountPaid?: number;
  total?: string;
  remark: string;
  setRemark: React.Dispatch<React.SetStateAction<string>>;
  hotelId?: string | null;
  setVoucherCode?: React.Dispatch<React.SetStateAction<string>>;
  voucherCode?: string;
  isView?: boolean;
  arrDeptDate?: [string, string] | null;
  setErrorVoucher?: React.Dispatch<React.SetStateAction<IError[]>>;
  errorVoucher?: IError[];
  isEdit?: boolean;
  bookingStatus?: number;
  isGroup?: boolean;
  individualList?: IndividualListItem[];
}
const DetailInfo = (props: IProps) => {
  const {
    totalRoomCharge = 0,
    specialSvcAmt = 0,
    deposit,
    amountPaid,
    remark,
    total = 'Total',
    setRemark,
    hotelId,
    setVoucherCode,
    voucherCode,
    isView = true,
    arrDeptDate,
    errorVoucher,
    setErrorVoucher,
    isEdit = false,
    bookingStatus,
    isGroup = false,
    individualList,
  } = props;
  const remarkOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRemark(value);
  };

	const voucherContainerRef = useRef<HTMLDivElement>(null);
	const [visibleVoucherCount, setVisibleVoucherCount] = useState(0);
  const totalCharge = totalRoomCharge + specialSvcAmt;
  const balance = totalCharge - (deposit || 0) - (amountPaid || 0);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const handleShowVoucher = () => {
    setShowVoucherModal(true);
  };

	useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (voucherContainerRef.current) {
        const containerWidth = voucherContainerRef.current.offsetWidth - 65;
        const avgVoucherWidth = 130;
        const count = Math.floor(containerWidth / avgVoucherWidth);
        setVisibleVoucherCount(count + 1);
      }
    });

    // Thêm observer vào container chứa các voucher
    if (voucherContainerRef.current) {
      resizeObserver.observe(voucherContainerRef.current);
    }

    return () => {
      // Dọn dẹp observer khi component unmount
      resizeObserver.disconnect();
    };
  }, [voucherCode]);


  return (
    <>
      <MyCard title="DETAIL INFORMATION">
        <div className="charge-container">
          <div className="charge-item">
            <p className="charge-label">Total Room Charge</p>
            <span>{`${formatNumberMoney(totalRoomCharge)}`}</span>
          </div>
          <div className="charge-item">
            <p className="charge-label">Special Service Charge</p>
            <span>{`${formatNumberMoney(specialSvcAmt)}`}</span>
          </div>
          <div className="total charge-item">
            <p className="charge-label-price">{total}</p>
            <span className="charge-price">{`${formatNumberMoney(
              totalCharge
            )}`}</span>
          </div>

          <div className="charge-item">
            <p className="charge-label-price">Deposit</p>
            <span>
              {deposit !== undefined ? formatNumberMoney(deposit) : '-'}
            </span>
          </div>
          <div className="charge-item">
            <p className="charge-label-price">Amount Paid</p>
            <span>
              {amountPaid !== undefined ? formatNumberMoney(amountPaid) : '-'}
            </span>
          </div>
          <div className="charge-item">
            <p className="charge-label-price">Balance</p>
            <span className="charge-price">{`${formatNumberMoney(
              balance
            )}`}</span>
          </div>
        </div>
        <div className="promotion-voucher">
          <MyCardContent>
            <div className="promotion">
              <div className="title">
                <p>Promotion</p>
                <a className="btn">Detail</a>
              </div>
              <div className="container">
                <Tooltip title="1234565">
                  <span>Breakfast</span>
                </Tooltip>
              </div>
            </div>
            <div className="voucher">
              <div className="title">
                <p>Voucher</p>
                <a className="btn" onClick={handleShowVoucher}>
                  Detail
                </a>
              </div>
              <div className="container" ref={voucherContainerRef}>
                {voucherCode && (
                  <>
                    <Tooltip title={voucherCode}>
                      <span className="voucher-text">{voucherCode}</span>
                    </Tooltip>
                    <div className='count'>
											{voucherCode?.split(',').filter(Boolean).slice(visibleVoucherCount).length > 0 && (
												<a className="voucher-count" onClick={handleShowVoucher}>
													{voucherCode.split(',').filter(Boolean).slice(visibleVoucherCount).length}
												</a>
											)}
										</div>
                  </>
                )}
              </div>
            </div>
          </MyCardContent>
        </div>
        <div className="remark-container">
          <h2>Remark</h2>
          <MyTextArea value={remark} onChange={remarkOnChange} />
        </div>
      </MyCard>
      <Voucher
        hotelId={hotelId}
        isOpen={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        setVoucherCode={setVoucherCode}
        isView={isView}
        arrDeptDate={arrDeptDate}
        isEdit={isEdit}
        voucherCode={voucherCode}
        bookingStatus={bookingStatus}
        isGroup={isGroup}
        individualList={individualList}
      />
    </>
  );
};

export default DetailInfo;
