
# Backend - Hệ thống quản lý món ăn

## 1. Công nghệ sử dụng
- Node.js
- Express.js
- MongoDB Atlas
- Docker
- Docker Hub

## 2. Docker Image
Docker Hub:
https://hub.docker.com/r/nguyenvantien236306/236306-nguyenvantien-backend

Image:
docker.io/nguyenvantien236306/236306-nguyenvantien-backend:1.0

## 3. Build Docker Image
Chạy tại thư mục gốc của dự án:

```bash
docker build -t nguyenvantien236306/236306-nguyenvantien-backend:1.0 ./backend
```

## 4. Chạy container

Cần chuẩn bị file backend/.env có biến MONGODB_URI hợp lệ.

```bash
docker run -d \
  --name food-backend \
  -p 5000:5000 \
  --env-file backend/.env \
  -e PORT=5000 \
  nguyenvantien236306/236306-nguyenvantien-backend:1.0
```

## 5. Kiểm tra API

```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/foods
curl "http://localhost:5000/api/foods?search=pho"
```

## 6. Xem log và dừng container

```bash
docker logs food-backend
docker stop food-backend
docker rm food-backend
```

## 7. Đẩy image lên Docker Hub

```bash
docker login -u nguyenvantien236306
docker push nguyenvantien236306/236306-nguyenvantien-backend:1.0
docker push nguyenvantien236306/236306-nguyenvantien-backend:latest
```

## 8. Lưu ý bảo mật
- Không commit file .env lên GitHub.
- Không đưa thông tin đăng nhập MongoDB Atlas vào Dockerfile.
- Truyền thông tin kết nối qua biến môi trường khi chạy container.
