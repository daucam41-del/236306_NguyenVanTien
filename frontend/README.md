
# Frontend - Hệ thống quản lý món ăn

## 1. Công nghệ
- React
- Vite
- Nginx
- Docker
- Docker Hub

## 2. Docker Image
https://hub.docker.com/r/nguyenvantien236306/236306-nguyenvantien-frontend

Image:
docker.io/nguyenvantien236306/236306-nguyenvantien-frontend:1.0

## 3. Build Docker Image
Chạy tại thư mục gốc dự án:

```bash
docker build -t nguyenvantien236306/236306-nguyenvantien-frontend:1.0 ./frontend
```

## 4. Chạy container

```bash
docker run -d \
  --name food-frontend \
  -p 8080:80 \
  nguyenvantien236306/236306-nguyenvantien-frontend:1.0
```

Mở website tại:
http://localhost:8080

## 5. Kiểm tra container

```bash
docker ps
docker logs food-frontend
```

## 6. Dừng và xóa container

```bash
docker stop food-frontend
docker rm food-frontend
```

## 7. Push image lên Docker Hub

```bash
docker login -u nguyenvantien236306
docker push nguyenvantien236306/236306-nguyenvantien-frontend:1.0
docker push nguyenvantien236306/236306-nguyenvantien-frontend:latest
```

## 8. Lưu ý
- Frontend được build bằng Vite và phục vụ bằng Nginx.
- URL Backend cần được cấu hình phù hợp khi triển khai.
- Không đưa thông tin bí mật vào Docker image.
