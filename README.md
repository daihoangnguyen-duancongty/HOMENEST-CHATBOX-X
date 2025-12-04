



================================================================SEVER=====================================================================

✅ BƯỚC 2 – CHẠY 3 APP BẰNG PM2
PM2 setup đúng cách cho frontend

1️⃣ Admin-web

cd /var/www/homenest-chatbot-x/admin-web
npm install
pm2 start npm --name "admin-web" -- start -- -p 3001


2️⃣ Client-web

cd /var/www/homenest-chatbot-x/client-web
npm install
pm2 start npm --name "client-web" -- start -- -p 3002


3️⃣ Chatbot

Nếu đã build bằng vite build trước đó:

cd /var/www/homenest-chatbot-x/chatbot
npm install
pm2 start npm --name "chatbot" -- run preview -- --port 3003








Kiểm tra
pm2 list
pm2 logs admin-web
pm2 logs client-web
pm2 logs chatbot






--> Khi thay đổi code và đẩy lại trên server:

cd /www/backend
npx tsc
pm2 stop backend
pm2 delete backend
pm2 start dist/server.js --name backend --update-env













==================================================================LOCAL================================================================
# Build Chatbot plugin wordpress

cd lần lượt vào thư mục admin-web, chatbot, client-wev sau đó chạy để build widget-frontend và các dashboard ra thành file js,css dùng cho plugin wordpress :

npm run build

# Nhúng vào Wordpress

Bước 1: Kích hoạt plugin

Đăng nhập vào WordPress Admin (/wp-admin).

Vào menu Plugins → Installed Plugins.

Tìm plugin Homenest Chatbot Widget trong danh sách.

Nhấn Activate (Kích hoạt).

Sau khi kích hoạt, plugin sẽ sẵn sàng hoạt động. Bạn cũng sẽ thấy menu Chatbot Dashboard xuất hiện trong admin menu.

Bước 2: Thêm shortcode vào Page/Post

Vào Pages → All Pages hoặc Posts → All Posts.

Chọn Page/Post bạn muốn hiển thị chatbot, hoặc tạo mới.

Trong editor (Gutenberg hoặc Classic Editor), thêm shortcode block (hoặc trực tiếp trong Classic Editor):

[homenest_chatbot]

Nếu muốn override client_id hoặc api_endpoint, dùng:

[homenest_chatbot client_id="realclient123" api_endpoint="https://homenest-chatbot-backend.up.railway.app/api/chat"]

Lưu/Update page.

Bước 3: Kiểm tra front-end

Mở page/post vừa thêm shortcode trên trình duyệt.

-> thấy nút chatbot ở góc màn hình (theo CSS bạn đã thiết lập).

Nhấn nút để mở widget.

Thử nhập tin nhắn → widget sẽ gửi yêu cầu đến backend.

Nếu mọi thứ đúng, bot sẽ phản hồi.

Mở DevTools (F12) → tab Network kiểm tra request gửi tới backend.

Mở Console xem có lỗi nào liên quan đến clientId hoặc API không.

#---------------------Test Postman---------------------------------------

#---------------------Sử dụng---------------------------------------------
-> ==============================Tạo tài khoản Admin của HomeNest

Bước 1: Tạo admin trực tiếp trong MongoDB Atlas
Register admin qua Postman / frontend:

POST https://homenest-chatbox-x-production.up.railway.app/admin-api/auth/register

Ví dụ:

Body: {
"username": "superadmin",
"password": "12345678",
"name": "HomeNest Super Admin",
"avatar": "https://i.pravatar.cc/150?u=superadmin"
}

Bước 2: Login admin để lấy token admin:

POST https://homenest-chatbox-x-production.up.railway.app/admin-api/auth/login

Ví dụ:

Body: {
"username": "superadmin",
"password": "12345678"
}

Nhận token Admin để gọi các route admin.

Ví dụ:

{
"ok": true,
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xNzYzMjAyMjc3ODU4IiwidXNlcm5hbWUiOiJzdXBlcmFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYzMjczODgxLCJleHAiOjE3NjM4Nzg2ODF9.Qr9p0pBVGOKjg_VOMxIjpCc7wQ-Ws7WBcBnBaP35dTM",
"admin": {
"username": "superadmin",
"name": "HomeNest Super Admin",
"role": "admin",
"avatar": "https://i.pravatar.cc/150?u=superadmin"
}
}

->==================================================== Homenest Admin tạo tài khoản Client

- đăng ký client (do công ty tạo chứ ko đăng ký) khi có người dùng mua gói chatbot (1 client cớ thể có nhiều user sử dụng bên trong với lịch sử chat riêng biệt)

Tạo client qua endpoint Admin trên Postman

Nếu đã triển khai /admin-api/clients:

URL: POST /admin-api/clients

Headers: Authorization: Bearer <ADMIN_SYNC_TOKEN>

Body:
{
"action": "create",
"client": {
"clientId": "testclient123",
"name": "Test Client",
"domain": "example.com",
"color": "#0b74ff",
"welcome_message": "Xin chào!",
"ai_provider": "openai"
}
}

-> =====================================================Client sẽ đăng nhập vào dashboard và tự tạo các user của họ

#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

✅ 1. KIẾN TRÚC TỔNG QUAN


PROJECT 1: BACKEND

backend/
├─ graphql/
│ ├─ schema.ts
│ └─ resolvers.ts
├─ routes/
│ ├─ ChatRoutes.ts
│ ├─ AdminRoutes.ts
│ ├─ UserRoutes.ts
│ └─ AdminAuthRoutes.ts
├─ database/
│ └─ db.ts
├─ sentry.ts
├─ server.ts
├─ package.json
└─ tsconfig.json



PROJECT 2: ADMIN-WEB

admin-web/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                <-- redirect sang login
│  ├─ auth/
│  │  ├─ login/page.tsx
│  │  └─ register/page.tsx
│  ├─ protected/
│  │  ├─ layout.tsx           <-- ProtectedLayout
│  │  ├─ dashboard/page.tsx
│  │  └─ clients/page.tsx
├─ src/
│  ├─ store/authSlice.ts
│  ├─ config/fetcher.ts
│  ├─ config/token.ts
│  └─ providers.ts


PROJECT 3: CLIENT-WEB



client-web/
└─ src/
   └─ app/
      ├─ login/
      │   └─ page.tsx              ← Trang đăng nhập
      │
      ├─ dashboard/                ← Tất cả giao diện khi đã login
      │   ├─ page.tsx              ← Dashboard Home
      │   ├─ employees/
      │   │   └─ page.tsx
      │   ├─ api-keys/
      │   │   └─ page.tsx
      │   ├─ profile/
      │   │   └─ page.tsx
      │   ├─ subscription/
      │       └─ page.tsx
      │
      ├─ plugin/
      │   └─ page.tsx              ← UI iframe chạy trong website khách
      │
      ├─ api/
      │   └─ route.ts              ← Nếu có Next.js API routes
      │
      ├─ graphql/
      │   ├─ client.ts             ← GraphQL client
      │   ├─ mutations.ts
      │   └─ queries.ts
      │
      ├─ layout.tsx                ← Layout gốc
      ├─ provider.tsx              ← Context provider
      └─ page.tsx                  ← redirect("/") → "/login"




✅ 2. TEST

Admin Homenest

TK2:

User: superadmin2
Pass: 123457


Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi0xNzYzNDM3NTg0MzA1IiwidXNlcm5hbWUiOiJzdXBlcmFkbWluMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MzQzNzc2NSwiZXhwIjoxNzY0MDQyNTY1fQ.0VNDtuZvJzf02MBKXRCgHuYWbiciyM5qhLTJStZ5irA








