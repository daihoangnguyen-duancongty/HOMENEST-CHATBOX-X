
# Build Chatbot plugin wordpress
Chạy để build widget-frontend ra thành file js,css dùng cho plugin wordpress :
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

#---------------------Sử dụng---------------------------------------------
-> Tạo tài khoản Admin của HomeNest

1. Tạo admin trực tiếp trong MongoDB Atlas
Bước 1: Mở MongoDB Compass → chọn database → collection users
Bước 2: Ấn Insert Document và dán nội dung sau:

{
  "userId": "admin-0001",
  "clientId": null,
  "username": "superadmin",
  "password": "$2b$10$mR3G7J4iPvt1Tj3gYag29OQfcJrG4BCfs5nu9e", 
  "name": "HomeNest Super Admin",
  "avatar": null,
  "role": "admin",
  "created_at": "2025-11-15T00:00:00.000Z"
}
🔑 Mật khẩu gốc "12345678" đã được hash sẵn bằng bcrypt.

(Vì password trên đã được hash bằng bcrypt để phù hợp model.)

Bước 3:
4) Sau khi insert, dùng API login:

POST

https://homenest-chatbox-x-production.up.railway.app/admin-api/login


Body

{
  "username": "superadmin",
  "password": "12345678",
  "name": "Super Admin",
  "avatar": null
}




Nhận token để gọi các route admin.



-> Homenest Admin tạo tài khoản Client

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


-> Client sẽ đăng nhập vào dashboard và tự tạo các user của họ