import React, { useEffect, useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';

// Định nghĩa kiểu dáng cho PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    marginBottom: 5,
  },
});

// Component PDF cho CV
const CvDocument = ({ userData }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Hồ Sơ Cá Nhân</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông Tin Cá Nhân</Text>
        <Text style={styles.text}>Họ và Tên: {userData.name}</Text>
        <Text style={styles.text}>Email: {userData.email}</Text>
        <Text style={styles.text}>Số điện thoại: {userData.phone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Học Vấn</Text>
        <Text style={styles.text}>{userData.education}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kinh Nghiệm Làm Việc</Text>
        <Text style={styles.text}>{userData.experience}</Text>
      </View>
    </Page>
  </Document>
);

// Component chính
const CreateCvContainer = () => {
  const [isClient, setIsClient] = useState(false);
  const [fontError, setFontError] = useState(null); // Thêm state để theo dõi lỗi font
  const [userData, setUserData] = useState({
    name: 'Nguyễn Văn A',
    email: 'nguyen.van.a@example.com',
    phone: '0123 456 789',
    education: '2018 - 2022: Cử nhân Công nghệ Thông tin, Đại học Bách Khoa',
    experience: '2022 - Hiện tại: Lập trình viên, Công ty Phần mềm XYZ',
  });

  // Đăng ký font Roboto
  useEffect(() => {
    setIsClient(true);
    try {
      Font.register({
        family: 'Roboto',
        fonts: [
          {
            src: `/font/Roboto-Regular.ttf`, // Sử dụng PUBLIC_URL
            fontWeight: 'normal',
          },
          {
            src: `/font/Roboto-Bold.ttf`,
            fontWeight: 'bold',
          },
        ],
      });
      console.log('Font Roboto đã đăng ký thành công');
    } catch (error) {
      console.error('Lỗi khi đăng ký font:', error);
    }
  }, []);

  // Xử lý thay đổi input
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard bg-white m-[20px] pl-[20px]">
      <h1 className="text-2xl font-bold mb-4">Tạo CV</h1>

      {/* Hiển thị thông báo lỗi font nếu có */}
      {fontError && <div className="text-red-500 mb-4">{fontError}</div>}

      {/* Form nhập liệu */}
      <div className="form mb-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Nhập Thông Tin</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium">Họ và Tên</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Học Vấn</label>
            <textarea
              name="education"
              value={userData.education}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Kinh Nghiệm Làm Việc
            </label>
            <textarea
              name="experience"
              value={userData.experience}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Bản xem trước CV */}
      <div className="cv-preview mb-4 p-4 border rounded">
        <h2 className="text-xl font-bold">Hồ Sơ Cá Nhân</h2>
        <div className="mt-2">
          <h3 className="font-semibold">Thông Tin Cá Nhân</h3>
          <p>Họ và Tên: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <p>Số điện thoại: {userData.phone}</p>
        </div>
        <div className="mt-2">
          <h3 className="font-semibold">Học Vấn</h3>
          <p>{userData.education}</p>
        </div>
        <div className="mt-2">
          <h3 className="font-semibold">Kinh Nghiệm Làm Việc</h3>
          <p>{userData.experience}</p>
        </div>
      </div>

      {/* Nút tải PDF */}
      {isClient && (
        <PDFDownloadLink
          document={<CvDocument userData={userData} />}
          fileName="cv.pdf">
          {({ loading }: any) =>
            loading ? (
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                disabled>
                Đang tạo PDF...
              </button>
            ) : (
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Tải CV dưới dạng PDF
              </button>
            )
          }
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default CreateCvContainer;
