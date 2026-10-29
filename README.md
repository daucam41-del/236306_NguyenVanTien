# HỆ THỐNG QUẢN LÝ MÓN ĂN TRÊN NỀN TẢNG ĐÁM MÂY

## 1. Thông tin đề tài

- **MSSV:** 236306
- **Họ và tên:** Nguyễn Văn Tiến
- **Đề tài:** Xây dựng và triển khai hệ thống quản lý món ăn trên nền tảng đám mây.

## 2. Công nghệ sử dụng

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Cơ sở dữ liệu:** MongoDB Atlas
- **Quản lý mã nguồn:** Git, GitHub
- **Đóng gói ứng dụng:** Docker
- **Lưu trữ Docker Image:** Docker Hub
- **Triển khai ứng dụng:** Render

## 3. Cấu trúc dự án

```text
236306_NguyenVanTien/
├── backend/
│   ├── routes/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

## 4. Chức năng hệ thống

- Hiển thị danh sách món ăn.
- Xem thông tin chi tiết món ăn.
- Thêm món ăn mới.
- Cập nhật thông tin món ăn.
- Xóa món ăn.
- Tìm kiếm món ăn.
- Lưu trữ dữ liệu trên MongoDB Atlas.
- Cung cấp REST API để Frontend giao tiếp với Backend.

## 5. Cơ sở dữ liệu

- **Nền tảng:** MongoDB Atlas
- **Tên database:** `236306_NguyenVanTien`
- **Collection:** `foods`

Dữ liệu mẫu gồm Phở bò, Cơm tấm sườn và Bún bò Huế.

Thông tin kết nối cơ sở dữ liệu được cấu hình thông qua biến môi trường `MONGODB_URI`. Không lưu thông tin tài khoản hoặc mật khẩu cơ sở dữ liệu trong mã nguồn công khai.

## 6. Các API chính

| Phương thức | Endpoint | Chức năng |
|---|---|---|
| GET | `/health` | Kiểm tra trạng thái Backend và kết nối cơ sở dữ liệu |
| GET | `/api/foods` | Lấy danh sách món ăn |
| GET | `/api/foods/:id` | Lấy chi tiết món ăn |
| POST | `/api/foods` | Thêm món ăn |
| PUT | `/api/foods/:id` | Cập nhật món ăn |
| DELETE | `/api/foods/:id` | Xóa món ăn |

## 7. Triển khai trên nền tảng đám mây

### 7.1. Frontend

- Công nghệ: React, Vite.
- Nền tảng triển khai: Render Static Site.
- URL: https://two36306-nguyenvantien-frontend.onrender.com/

### 7.2. Backend

- Công nghệ: Node.js, Express.
- Đóng gói bằng Docker.
- Nền tảng triển khai: Render Web Service.
- URL: https://food-backend-236306.onrender.com/health

### 7.3. Cơ sở dữ liệu

- MongoDB Atlas được sử dụng để lưu trữ dữ liệu món ăn.
- Backend kết nối cơ sở dữ liệu thông qua biến môi trường `MONGODB_URI` được cấu hình trên Render.

### 7.4. Docker Hub

- Backend Image: `nguyenvantien236306/236306-nguyenvantien-backend:1.0`
- Frontend Image: `nguyenvantien236306/236306-nguyenvantien-frontend:1.0`

## 8. Hướng dẫn cài đặt và chạy tại máy local

### Yêu cầu

- Node.js và npm.
- MongoDB Atlas hoặc một MongoDB server tương thích.
- Git.

### Chạy Backend

1. Mở terminal tại thư mục `backend/`.
2. Cài đặt các thư viện:

```bash
npm install
```

3. Tạo file `.env` và cấu hình biến môi trường `MONGODB_URI` bằng chuỗi kết nối MongoDB của bạn.
4. Khởi động Backend:

```bash
npm start
```

### Chạy Frontend

1. Mở terminal khác tại thư mục `frontend/`.
2. Cài đặt thư viện:

```bash
npm install
```

3. Tạo file `.env` nếu cần và cấu hình `VITE_API_URL` bằng URL Backend tương ứng.
4. Khởi động Frontend:

```bash
npm run dev
```

## 9. Quản lý mã nguồn

- GitHub Repository: https://github.com/daucam41-del/236306_NguyenVanTien

## 10. Kết luận

Dự án xây dựng hệ thống quản lý món ăn sử dụng React, Node.js, Express và MongoDB Atlas. Ứng dụng được đóng gói bằng Docker và triển khai trên Render, giúp người dùng truy cập hệ thống qua Internet và quản lý dữ liệu món ăn thông qua các API.
