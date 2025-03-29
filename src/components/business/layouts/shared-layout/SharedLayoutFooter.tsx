import { Pagination } from 'antd';
import './style.less';
import { SharedLayoutFooterProps } from './type';

export const SharedLayoutFooter = ({
  onPageChange,
  total,
  current,
  pageSize,
  isShowNote = false,
  isRoomAvaibility = false,
}: SharedLayoutFooterProps) => {
  return (
    <div className="content-footer">
      <div className="content-footer-container">
        <div className="content-footer-note">
          {isShowNote && (
            <>
              <div className="note-tag note-tag-weekend">
                <div className="note-icon weekend"></div>
                <p>Weekend</p>
              </div>
              <div className="note-divider"></div>
              {!isRoomAvaibility && (
                <div className="note-tag note-tag-holiday">
                  <div className="note-icon holiday"></div>
                  <p>Holiday</p>
                </div>
              )}
              {isRoomAvaibility && (
                <div className="note-tag note-tag-holidayRed">
                  <div className="note-icon holidayRed"></div>
                  <p>Holiday</p>
                </div>
              )}
            </>
          )}
        </div>
        <Pagination
          className="pagination"
          showSizeChanger
          onChange={onPageChange}
          current={current}
          pageSize={pageSize}
          pageSizeOptions={[15, 30]}
          total={total}
          showTotal={total => `Total: ${total}`}
        />
      </div>
    </div>
  );
};
