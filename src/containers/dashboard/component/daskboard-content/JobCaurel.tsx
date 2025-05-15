import React from 'react';
import { Card, Typography, Button, Carousel } from 'antd';
import 'antd/dist/reset.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const JobCard = ({ job, className }: any) => {
  return (
    <div className={`${className} p-2 `}>
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
              background: `url(${
                job?.cover_photo ||
                'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ff1e3a0b-d453-4f25-9d40-b639ea34eac6/d8b0e2q-c3445053-675a-4952-9be8-11884fd5c7d7.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2ZmMWUzYTBiLWQ0NTMtNGYyNS05ZDQwLWI2MzllYTM0ZWFjNlwvZDhiMGUycS1jMzQ0NTA1My02NzVhLTQ5NTItOWJlOC0xMTg4NGZkNWM3ZDcuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.TNA3OxHyji3j7IYYhoKKMv0Z9RkWkP-pcdTdxLU6h3E'
              }) center/cover no-repeat`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            {job?.name}
          </div>
        }
        actions={[
          <Button type="link" href={'#'} className="text-primary ">
            Xem công ty
          </Button>,
        ]}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 4,
          }}>
          <img
            src={
              job?.avatar ||
              'https://img.freepik.com/free-vector/contact-icon-3d-vector-illustration-blue-button-with-user-profile-symbol-networking-sites-apps-cartoon-style-isolated-white-background-online-communication-digital-marketing-concept_778687-1715.jpg'
            }
            alt="Company Logo"
            style={{ width: 40, height: 40 }}
          />
          <Title level={5} style={{ margin: 0 }}>
            {job?.name}
          </Title>
        </div>
        {/* <Text>{description}</Text> */}
        {/* <BookmarkOutlined style={{ position: "absolute", top: 10, right: 10, fontSize: 20 }} /> */}
      </Card>
    </div>
  );
};

const JobCarousel = ({ jobs }: any) => {
  console.log('job', jobs);
  return (
    <Carousel slidesToShow={3} slidesToScroll={1} arrows autoplay dots={false}>
      {jobs.map((job: any, index: number) => (
        <JobCard className="" key={index} job={job} />
      ))}
    </Carousel>
  );
};

export default JobCarousel;
