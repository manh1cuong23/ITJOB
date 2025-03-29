import React, { useState, useEffect } from "react";
import { Modal as AntdModal, ModalProps as AntdModalProps } from "antd"; // Import Modal và ModalProps từ Ant Design
import { MyButton } from "../button";
import { ReactComponent as Tick } from "@/assets/icons/ic_ticks.svg";
import  { ReactComponent as CloseSvg } from "@/assets/icons/ic_close_form.svg";
import './style.less'
// Mở rộng props của Antd Modal
interface ModalProps extends AntdModalProps {
  onOk?: () => void;
  onCancel: () => void;
  title: React.ReactNode;
  onBack?: () => void;
  children: React.ReactNode;
}

const BaseModal: React.FC<ModalProps> = ({
  open,
  onOk,
  onCancel,
  title,
  onBack,
  children,
  ...rest // Spread all other props
}) => {
  const [isVisible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  return (
    <AntdModal
      open={isVisible}
      onOk={onOk}
      // forceRender
      onCancel={onCancel}
      title={title}
      centered
      className="my-modal"
      closeIcon= {<CloseSvg width={20} height={20}/>}
      maskClosable={false}
      footer={[
        <MyButton key="cancel" onClick={onCancel} buttonType="outline">
          Cancel
        </MyButton>,
        <MyButton key="save" onClick={onOk} icon={<Tick />}>
          Save
        </MyButton>,
      ]}
      {...rest} // Apply all other props to AntdModal
    >
      {children}
    </AntdModal>
  );
};

export default BaseModal;
