import { css } from '@emotion/react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useState } from 'react';
import { Typography, Space, Col, Row } from 'antd';
const { Title } = Typography;
interface IMyPagePDF {
  SearchComponent: React.FunctionComponent<any>;
  title: string;
}

export default function MyPageReport(props: IMyPagePDF) {
  const { SearchComponent, title } = props;
  const [pdfUrl, setPdfUrl] = useState();
  const newplugin = defaultLayoutPlugin();

  return (
    <div css={style}>
      <div className="report-container">
        <Title level={4} className="report-header">
          {title || 'My Page Title'}
        </Title>
        <Row className="report-content">
          <Col span={17} className="report-preview">
            {!pdfUrl && <p>Chưa có dữ liệu</p>}
            {pdfUrl && (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer fileUrl={pdfUrl} plugins={[newplugin]} />
              </Worker>
            )}
          </Col>
          <Col span={7} className="report-action">
            <SearchComponent pdfUrl={pdfUrl} setPdfUrl={setPdfUrl} />
          </Col>
        </Row>
      </div>
    </div>
  );
}

const style = css`
  background: #efefef;
  width: 100%;
  height: calc(100vh - 64px);
  .report-container {
    background: #fff;
    margin: 5px;
    display: flex;
    flex: 1;
    flex-direction: column;
    border-radius: 8px;
    height: calc(100vh - 74px);
  }
  .report-content {
    height: 100%;
  }
  .report-header {
    padding: 4px 8px;
    margin: 0px;
    background: #fafafa;
    border-bottom: 1px solid #ecece1;
    width: 100%;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    line-height: 44px;
  }
  .report-preview {
    background: #ccc;
    padding: 5px;
    max-height: calc(100vh - 132px);
  }
  .report-action {
    background: #fff;
  }
`;
