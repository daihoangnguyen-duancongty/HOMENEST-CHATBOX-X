<?php
if (!defined('ABSPATH')) exit;

add_action('admin_menu', function(){
    add_menu_page(
        'Chatbot X',
        'Chatbot X',
        'manage_options',
        'chatbotx-settings',
        'chatbotx_render_settings_page',
        'dashicons-format-chat'
    );
});

function chatbotx_render_settings_page() {
    $clientId = get_option("chatbotx_client_id");
    $apiKey   = get_option("chatbotx_api_key");

    ?>
    <div class="wrap">
        <h1>Chatbot X</h1>

        <?php if (!$clientId || !$apiKey): ?>
            <h2>Thiết lập Chatbot</h2>
            <p>Nhập email để tạo client mới:</p>
            <form method="post">
                <input type="email" name="chatbotx_email" required placeholder="Email admin" style="width:300px"/>
                <input type="submit" name="chatbotx_submit" class="button button-primary" value="Tạo Client">
            </form>
            <?php
            if (!empty($_POST['chatbotx_submit']) && !empty($_POST['chatbotx_email'])) {
                $email = sanitize_email($_POST['chatbotx_email']);
                $siteUrl = get_site_url();

                $response = wp_remote_post(
                    "https://homenest-chatbox-x-production.up.railway.app/api/public/register-wp-site",
                    [
                        'method' => 'POST',
                        'headers' => ['Content-Type' => 'application/json'],
                        'body' => json_encode([
                            "domain" => $siteUrl,
                            "email" => $email
                        ]),
                         'timeout' => 20,
                    ]
                );

                if (!is_wp_error($response)) {
                    $data = json_decode(wp_remote_retrieve_body($response), true);
                    if (!empty($data['clientId'])) update_option('chatbotx_client_id', $data['clientId']);
                    if (!empty($data['apiKey'])) update_option('chatbotx_api_key', $data['apiKey']);

                    echo '<div class="updated notice"><p>Client mới đã được tạo!</p></div>';
                    // Reload page để hiển thị dữ liệu
                    echo '<meta http-equiv="refresh" content="1">';
                } else {
                    echo '<div class="error notice"><p>Lỗi khi tạo client: ' . esc_html($response->get_error_message()) . '</p></div>';
                }
            }
            ?>
        <?php else: ?>
            <h2>Thông tin tích hợp</h2>
            <table class="form-table">
                <tr>
                    <th>Client ID</th>
                    <td><strong><?php echo esc_html($clientId); ?></strong></td>
                </tr>
                <tr>
                    <th>API Key</th>
                    <td><strong><?php echo esc_html($apiKey); ?></strong></td>
                </tr>
                <tr>
                    <th>API Endpoint</th>
                    <td><strong>https://homenest-chatbox-x-production.up.railway.app/api</strong></td>
                </tr>
            </table>
            <p><em>Thông tin này tự động lưu trong database để widget có thể load.</em></p>
        <?php endif; ?>
    </div>
    <?php
}
