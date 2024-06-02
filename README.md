# Ngo Portal - Hệ thống Quản lý Bán hàng Hiệu quả

**Ngo Portal** là ứng dụng web quản lý bán hàng được xây dựng theo kiến trúc client-server, sử dụng các công nghệ hiện đại và hiệu năng cao.

## 📂 Cấu trúc dự án

Dự án bao gồm 2 thư mục chính:

1. **`/client`**: Chứa mã nguồn frontend được xây dựng bằng Next.js.
2. **`/server`**: Chứa mã nguồn backend được xây dựng bằng Elysia.

## 🚀 Công nghệ sử dụng

### 🎨 Client (Frontend):

- **Next.js:** Framework React cho trải nghiệm người dùng mượt mà.
- **Shadcn UI:**  Thư viện UI component đẹp mắt và dễ sử dụng.
- **Bun:** Trình quản lý package và runtime nhanh chóng.

### ⚙️ Server (Backend):

- **Elysia:** Web framework Node.js siêu nhanh và gọn nhẹ.
- **Drizzle ORM:**  Thư viện ORM giúp thao tác với database dễ dàng và type-safe.
- **PostgreSQL:** Hệ quản trị cơ sở dữ liệu mạnh mẽ và đáng tin cậy.


## 🛠️ Cài đặt & Chạy dự án

**Yêu cầu:**

- **Node.js:** Phiên bản 18 trở lên được khuyến nghị.
- **Bun:**  Cài đặt theo hướng dẫn tại [https://bun.sh/](https://bun.sh/).
- **PostgreSQL:** Cài đặt và khởi động PostgreSQL trên máy của bạn.

**Các bước:**

1. **Clone repository:**
   ```bash
   git clone https://github.com/ahtuan/ngo-portal.git
   cd ngo-portal
   ```

2. **Cài đặt dependencies:**
   ```bash
   # Cài đặt dependencies cho cả client và server
   bun install
   ```

3. **Cấu hình môi trường:**
    - Tạo file `.env` trong thư mục `/server` và thêm các biến môi trường cần thiết như thông tin kết nối database. Tham khảo file `.env.example` để biết thêm chi tiết.

4. **Khởi động server:**
   ```bash
   cd server
   bun run dev
   ```

5. **Khởi động client:**
   ```bash
   cd client
   bun run dev
   ```

6. **Truy cập ứng dụng:**
   Mở trình duyệt và truy cập `http://localhost:3000` (hoặc cổng bạn đã cấu hình cho client).
