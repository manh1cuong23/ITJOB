# Tổ chức thư mục dự án

Trong dự án React Admin sử dụng Ant Design, các component được tổ chức thành ba thư mục chính: `business`, `core`, và `basic`. Mỗi thư mục có vai trò và mục đích riêng trong việc cấu trúc ứng dụng.

## 1. `business`

- **Mô tả**: Chứa các component liên quan đến logic nghiệp vụ của ứng dụng. Đây là các thành phần đặc thù, phản ánh các chức năng nghiệp vụ cụ thể của dự án.
- **Ví dụ**:
  - `UserManagement`: Bảng quản lý người dùng.
  - `ProductTable`: Bảng quản lý sản phẩm.
  - `OrderForm`: Biểu mẫu đặt hàng.

## 2. `core`

- **Mô tả**: Chứa các component lõi của ứng dụng, là các thành phần chung và tái sử dụng trên toàn bộ ứng dụng. Những component này ít phụ thuộc vào nghiệp vụ cụ thể.
- **Ví dụ**:
  - `Layout`: Bố cục chung của trang.
  - `Header`: Thanh tiêu đề của trang.
  - `Sidebar`: Thanh điều hướng bên trái.
  - `Footer`: Phần chân trang.

## 3. `basic`

- **Mô tả**: Chứa các component cơ bản, thường là các building blocks nhỏ mà từ đó các component lớn hơn có thể được xây dựng. Đây là các thành phần UI cơ bản, như button, input field, v.v.
- **Ví dụ**:
  - `Button`: Nút bấm.
  - `Input`: Trường nhập liệu.
  - `Card`: Thẻ hiển thị nội dung.

---

Việc tổ chức thư mục này giúp việc bảo trì và mở rộng dự án trở nên dễ dàng hơn, vì mỗi component được đặt vào vị trí phù hợp theo vai trò và mức độ phụ thuộc của nó trong ứng dụng.
