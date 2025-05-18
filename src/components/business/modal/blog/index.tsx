import { MyFormItem } from '@/components/basic/form-item';
import { MyModal } from '@/components/basic/modal';
import { Col, Form, message, Row, Spin, Upload } from 'antd';
import { InputBasic } from '../../input';
import ReactQuill from 'react-quill';
import { useEffect, useState } from 'react';
import { createBlog, updateBlog } from '@/api/features/admin';
import { uploadImage } from '@/api/features/media';

interface InsertUpdateBlogProps {
  open: any;
  title: string;
  onCancel: () => void;
  onOk: () => void;
}

const InsertUpdateBlog = ({
  open,
  title,
  onCancel,
  onOk,
}: InsertUpdateBlogProps) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>();

  const handleBeforeUpload = (file: any) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const isAllowedType = allowedImageTypes.includes(file.type);
    if (!isAllowedType) {
      message.error('Yêu cầu chọn file ảnh (jpg, png, gif)');
    } else {
      setPreview(URL.createObjectURL(file));
    }
    return isAllowedType ? false : Upload.LIST_IGNORE;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const { image, ...rest } = values;
      let resAvatar: any;
      if (!!image?.file) {
        const formData = new FormData();
        formData.append('image', image?.file);
        resAvatar = await uploadImage(formData);
      }
      const body = {
        ...rest,
        content,
        avatar: resAvatar ? resAvatar.result[0].url : open.avatar,
        blog_id: open?._id,
      };
      const res = open?._id ? await updateBlog(body) : await createBlog(body);
      if (!res.data) return message.error(res.message);
      onOk();
      message.success(res.message);
      onCancel();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open._id) {
      form.setFieldsValue(open);
      setContent(open.content);
    }
  }, [open]);

  return (
    <MyModal
      width="90vw"
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={handleSubmit}>
      <Spin spinning={loading}>
        <Form form={form}>
          <Row>
            <Col span={4}>
              <Form.Item name="image">
                <Upload.Dragger
                  beforeUpload={file => handleBeforeUpload(file)}
                  accept="image/*"
                  multiple={false}
                  maxCount={1}
                  fileList={[]}>
                  <div>Chọn ảnh đại diện cho blog</div>
                  <img
                    style={{ width: '100%', height: '170px' }}
                    src={!!preview ? preview : open?.avatar}
                    alt=""
                  />
                </Upload.Dragger>
              </Form.Item>
            </Col>
            <Col span={24}>
              <InputBasic label="Tiêu đề" name="title" isSpan required />
            </Col>
            <Col span={24}>
              <MyFormItem
                name="content"
                label="Nội dung"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}>
                <div>
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    className="h-[600px] mb-10"
                  />
                </div>
              </MyFormItem>
            </Col>
          </Row>
        </Form>
      </Spin>
    </MyModal>
  );
};

export default InsertUpdateBlog;
