import React from 'react';
import { Card, Typography, Button, Carousel } from 'antd';
import 'antd/dist/reset.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const JobCard = ({
  logo,
  title,
  subtitle,
  description,
  jobsLink,
  backgroundImage,
  className,
}: any) => {
  return (
    <div className={`${className} p-2`}>
      <Card
        style={{
          borderRadius: 10,
          overflow: 'hidden',
          position: 'relative',
        }}
        cover={
          <div
            style={{
              height: 150,
              background: `url(${backgroundImage}) center/cover no-repeat`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            {subtitle}
          </div>
        }
        actions={[
          <Button type="link" href={jobsLink}>
            Xem vị trí tuyển dụng
          </Button>,
        ]}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={logo}
            alt="Company Logo"
            style={{ width: 40, height: 40 }}
          />
          <Title level={5} style={{ margin: 0 }}>
            {title}
          </Title>
        </div>
        <Text>{description}</Text>
        {/* <BookmarkOutlined style={{ position: "absolute", top: 10, right: 10, fontSize: 20 }} /> */}
      </Card>
    </div>
  );
};

const JobCarousel = ({ jobs }: any) => {
  return (
    <Carousel slidesToShow={3} slidesToScroll={1} arrows autoplay dots={false}>
      {jobs.map((job: any, index: number) => (
        <JobCard className="" key={index} {...job} />
      ))}
    </Carousel>
  );
};

export default JobCarousel;
