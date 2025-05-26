import {
  getListCandicate,
  getListJob,
  getStatusCandicate,
  inviteCandicate,
  makeApproveCV,
  makeRejectCV,
} from '@/api/features/recruite';
import { MyButton } from '@/components/basic/button';
import { MyFormItem } from '@/components/basic/form-item';
import { SingleSelectSearchCustom } from '@/components/basic/select';
import MyTag from '@/components/basic/tags/tag';
import ConfirmModal from '@/components/business/modal/ConfirmModal/BookInterviewModal';
import {
  ApplyStatus,
  applyStatusOptions,
  educationLevels,
  englishSkillOptions,
  experienceLevels,
  genders,
  levels,
} from '@/constants/job';
import { checkAndformatDate, formatDateNew } from '@/utils/formatDate';
import { getLableSingle } from '@/utils/helper';
import { Button, Form, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Label } from 'recharts';

const CVDetailContainer: React.FC = () => {
  const { id, applyId } = useParams();
  const [data, setData] = useState<any>([]);
  const [dataStatus, setDataStatus] = useState<any>({});
  const [dataJob, setDataJob] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [isInvite, setIsInvite] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const fetchById = async (id: string) => {
    const res = await getListCandicate({ user_id: id });
    if (res?.result) {
      const { candidate_info, email, fields_info, skills_info, _id } =
        res.result[0];
      setData({
        ...candidate_info,
        email: email,
        skills: skills_info,
        fields: fields_info,
        idUser: _id,
      });
    }
  };

  const fetchStatusCV = async () => {
    const res = await getStatusCandicate({ id: applyId, user_id: id });
    if (res?.result) {
      setDataStatus(res?.result);
    }
  };

  const fetListJob = async () => {
    const res = await getListJob([]);
    if (res?.result) {
      const data = res?.result?.jobs?.map((item: any) => ({
        label:
          item?.name +
          ' - ' +
          getLableSingle(item?.level, levels) +
          ' - ' +
          formatDateNew(item?.createdAt),
        value: item?._id,
      }));
      setDataJob(data);
    }
  };
  useEffect(() => {
    if (applyId == 'invite') {
      setIsInvite(true);
      fetListJob();
    }
  }, [applyId]);
  const makeAprroCv = async () => {
    if (applyId && applyId !== 'invite') {
      const res = await makeApproveCV(applyId);
      if (res && res?.message) {
        message.success('chuyển trạng thái ứng viên thành công');
        setOpen(false);
      }
    } else {
      const data1 = await form.validateFields();
      if (id) {
        const res = await inviteCandicate(data?.idUser, data1);
        if (res && res?.message != 'Ứng viên đã được mời') {
          message.success('Mời ứng viên thành công');
          setOpen(false);
        } else {
          message.error('Ứng viên này đã ứng tuyển công việc này rồi!');
        }
      }
    }
    fetchStatusCV();
  };
  const makeRejectCv = async () => {
    if (applyId) {
      const res = await makeRejectCV(applyId);
      if (res && res?.message) {
        message.success('chuyển trạng thái ứng viên thành công');
        setOpenCancel(false);
      }
    }
  };
  useEffect(() => {
    if (id) {
      fetchById(id);
      fetchStatusCV();
    }
  }, [id]);
  const dataUser = [
    {
      name: 'Ứng viên',
      value: data?.name,
    },
    {
      name: 'Ngày sinh',
      value: formatDateNew(data?.checkAndformatDate),
    },
    {
      name: 'Quê quán',
      value: data?.address,
    },
    {
      name: 'Giới tính',
      value: getLableSingle(data?.gender?.[0], genders),
    },
    {
      name: 'Email',
      value: data?.email,
    },
  ];
  const dataUser2 = [
    {
      name: 'Năm kinh nghiệm',
      value: getLableSingle(data?.experience_years, experienceLevels),
    },
    {
      name: 'Học Vấn',
      value: getLableSingle(data?.education, educationLevels),
    },
    {
      name: 'Cấp bậc',
      value: getLableSingle(data?.level, levels),
    },
    {
      name: 'Lĩnh vực',
      value: data?.fields?.[0]?.name,
    },
  ];
  const dataUser3 = [
    {
      name: 'Chức vụ hiện tại',
      value: data?.current_job_position,
    },
    {
      name: 'Mức lương mong muốn',
      value: data?.salary_expected,
    },
    {
      name: 'Trình độ tiếng anh',
      value: getLableSingle(data?.language_level, englishSkillOptions),
    },
    {
      name: 'Kĩ năng',
      value:
        data?.skills &&
        data?.skills?.length > 0 &&
        data?.skills?.map((item: any) => (
          <MyTag title={item?.name} className="mx-2 bg-red-300" />
        )),
    },
  ];
  return (
    <div className="  pt-[20px] bg-white  m-[20px] px-4">
      <div>
        <div className="flex gap-[16px] items-center mb-4">
          <h1 className="text-[22px] font-medium ">Chức danh/ Vị trí</h1>
          <h1>: {data?.feature_job_position}</h1>
        </div>
        <div className="flex items-center ml-5">
          <img
            className="w-[120px] h-[160px] bg-gray-500 object-cover mr-4"
            src={
              data?.avatar ||
              'https://png.pngtree.com/png-clipart/20231020/original/pngtree-job-candidate-post-employee-png-png-image_13372804.png'
            }
          />
          <div className="w-full">
            {dataUser &&
              dataUser.length > 0 &&
              dataUser.map((item, index) => (
                <div className="flex items-center gap-[16px] my-4">
                  <div className=" text-[14px] font-bold w-[100px]">
                    <h1>{item.name} :</h1>
                  </div>
                  <div className="">
                    <h1>{item.value}</h1>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <h1 className="text-[22px] font-medium my-4">Thông tin nghề nghiệp</h1>

        <div className="w-full ml-5 flex  gap-[40px]">
          <div>
            {dataUser2 &&
              dataUser2.length > 0 &&
              dataUser2.map((item, index) => (
                <div className="flex items-center gap-[16px] my-4">
                  <div className=" text-[14px] font-bold w-[150px]">
                    <h1>{item.name} :</h1>
                  </div>
                  <div className="">
                    <h1>{item.value}</h1>
                  </div>
                </div>
              ))}
          </div>
          <div>
            {dataUser3 &&
              dataUser3.length > 0 &&
              dataUser3.map((item, index) => (
                <div className="flex items-center gap-[16px] my-4">
                  <div className=" text-[14px] font-bold min-w-[200px]">
                    <h1>{item.name} :</h1>
                  </div>
                  <div className="">
                    <h1>{item.value}</h1>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="bg-white">
          <h1 className="text-[22px] font-medium py-4">CV</h1>
          <div>
            {data?.cv && data?.cv != '' && data?.cv?.length != 0 ? (
              <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Xem CV
              </Button>
            ) : (
              'Chưa có CV'
            )}

            <Modal
              title="Xem file PDF"
              open={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              footer={null}
              width="80%"
              style={{ top: 10 }}
              bodyStyle={{ height: 'calc(100vh - 100px)', padding: 0 }}>
              <iframe
                src={data?.cv}
                width="100%"
                height="600px"
                className="border"
                title="PDF Viewer"
              />
            </Modal>
          </div>
        </div>
      </div>
      <div className="py-4 flex justify-end gap-[16px]">
        {Object.keys(dataStatus || {}).length > 0 ? (
          dataStatus?.status == ApplyStatus.Pending ? (
            <div>
              <MyButton
                className="mx-2"
                onClick={() => setOpenCancel(true)}
                buttonType="secondary">
                Bỏ qua
              </MyButton>
              <MyButton className="mx-2" onClick={() => setOpen(true)}>
                {isInvite ? 'Mời ứng viên' : 'Phù hợp'}
              </MyButton>
            </div>
          ) : (
            <MyButton className="mx-2" disabled>
              {getLableSingle(dataStatus?.status, applyStatusOptions)}
            </MyButton>
          )
        ) : (
          <MyButton className="mx-2" onClick={() => setOpen(true)}>
            {'Mời ứng viên'}
          </MyButton>
        )}
      </div>

      <ConfirmModal
        title={`Xác nhận ứng viên`}
        open={openCancel}
        onFinish={makeRejectCv}
        setOpen={setOpenCancel}
        onCancel={() => {
          setOpenCancel(false);
        }}>
        <h1>Bạn xác nhận bỏ qua ứng viên này</h1>
      </ConfirmModal>
      <ConfirmModal
        title={`${!isInvite ? 'Xác nhận ứng viên' : 'Mời ứng viên'} `}
        open={open}
        onFinish={makeAprroCv}
        setOpen={setOpen}
        onCancel={() => {
          setOpen(false);
        }}>
        {!isInvite ? (
          <h1>Bạn xác nhận ứng viên này phù hợp với công việc</h1>
        ) : (
          <Form className="px-4" form={form}>
            <MyFormItem name="job_id" label="Công việc" required>
              <SingleSelectSearchCustom
                options={dataJob}
                placeholder="Vui lòng chọn công việc phù hợp với ứng viên"
              />
            </MyFormItem>
            <p className="text-[12px] text-gray-500 py-4">
              Lời mời sẽ được gửi đến ứng viên trong thời gian sớm nhất.
            </p>
          </Form>
        )}
      </ConfirmModal>
    </div>
  );
};

export default CVDetailContainer;
