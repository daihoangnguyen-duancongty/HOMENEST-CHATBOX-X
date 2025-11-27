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
        <h1>Chatbot X – Thông tin tích hợp</h1>

        <table class="form-table">
            <tr>
                <th>Client ID</th>
                <td><strong><?php echo esc_html($clientId ?: "Chưa tạo"); ?></strong></td>
            </tr>

            <tr>
                <th>API Key</th>
                <td><strong><?php echo esc_html($apiKey ?: "Chưa tạo"); ?></strong></td>
            </tr>

            <tr>
                <th>API Endpoint</th>
                <td><strong>https://homenest-chatbox-x-production.up.railway.app/api</strong></td>
            </tr>
        </table>

        <p><em>Các thông tin này tự động tạo khi kích hoạt plugin.</em></p>
    </div>
    <?php
}
