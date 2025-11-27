<?php
/**
 * Plugin Name: Chatbot X
 * Description: Phần mềm Chatbot thông minh tích hợp trực tiếp vào website hoặc ứng dụng, giúp tự động hóa tương tác với khách hàng 24/7 
 * Version: 1.1
 * Author: HomeNest
 */

if (!defined('ABSPATH')) exit;

define('CHATBOTX_DIR', plugin_dir_path(__FILE__));
define('CHATBOTX_URL', plugin_dir_url(__FILE__));

include_once CHATBOTX_DIR . 'admin/settings-page.php';

/**
 * 0) HOOK KÍCH HOẠT PLUGIN → GỬI DOMAIN + EMAIL LÊN BACKEND
 */
register_activation_hook(__FILE__, function () {
    $siteUrl = get_site_url();
    $adminEmail = get_option('admin_email');

    $response = wp_remote_post(
        "https://homenest-chatbox-x-production.up.railway.app/public/client/register-wp-site",
        [
            'method' => 'POST',
            'headers' => ['Content-Type' => 'application/json'],
            'body' => json_encode([
                "domain" => $siteUrl,
                "email" => $adminEmail
            ])
            
       
        ]
    );

    if (!is_wp_error($response)) {
        $data = json_decode(wp_remote_retrieve_body($response), true);

        if (!empty($data["clientId"])) {
            update_option("chatbotx_client_id", $data["clientId"]);
        }
        if (!empty($data["apiKey"])) {
            update_option("chatbotx_api_key", $data["apiKey"]); // frontend dùng apiKey
        }
    }
});


/**
 * 1) LOAD WIDGET + INLINE CONFIG
 */
add_action('wp_enqueue_scripts', function () {

    $clientId = get_option('chatbotx_client_id');
    $apiKey = get_option("chatbotx_api_key");
    $apiEndpoint = "https://homenest-chatbox-x-production.up.railway.app/api";

    if (!$clientId) return;

    wp_enqueue_style(
        'chatbotx-style',
        CHATBOTX_URL . 'assets/css/widget.css',
        [],
        '1.0'
    );



    wp_enqueue_script(
        'chatbotx-script',
        CHATBOTX_URL . 'assets/js/widget.js',
        [],
        '1.0',
        true
    );
    
    // Inject config
  wp_add_inline_script(
    'chatbotx-script',
    "window.HOMENEST_CHATBOT_WIDGET = {
        apiEndpoint: '$apiEndpoint',
        clientId: '$clientId',
        apiKey: '$apiKey'
    };",
    'before'
);

});
