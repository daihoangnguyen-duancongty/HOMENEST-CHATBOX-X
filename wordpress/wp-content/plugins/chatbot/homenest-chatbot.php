<?php
/*
Plugin Name: Homenest Chatbot Widget
Description: Chatbot widget cho WordPress + Admin Dashboard quản lý client.
Version: 1.0
Author: You
*/

if (!defined('ABSPATH')) exit; // bảo mật, tránh truy cập trực tiếp

// ✅ Enqueue React bundle + CSS
add_action('wp_enqueue_scripts', function() {
    // CSS
    wp_enqueue_style(
        'homenest-chatbot-css',
        plugin_dir_url(__FILE__) . 'assets/css/widget.css',
        array(),
        filemtime(plugin_dir_path(__FILE__) . 'assets/css/widget.css') // chống cache
    );

    // JS (chạy ở footer)
    wp_enqueue_script(
        'homenest-chatbot-js',
        plugin_dir_url(__FILE__) . 'assets/js/bundle.js',
        array(), // không cần dependencies
        filemtime(plugin_dir_path(__FILE__) . 'assets/js/bundle.js'), // chống cache
        true
    );
});

// ✅ Tự động hiển thị widget ở footer tất cả các page
add_action('wp_footer', function() {
    echo do_shortcode('[homenest_chatbot]');
});

// ✅ Shortcode để nhúng chatbot vào page/post
add_shortcode('homenest_chatbot', function($atts) {
    $atts = shortcode_atts(array(
        'client_id' => 'testclient123',
        'api_endpoint' => 'https://homenest-chatbox-x-production.up.railway.app/api/chat' // ✅ HTTPS đầy đủ
    ), $atts);

    ob_start();
    ?>
    <script>
        window.ABC_CHATBOT_WIDGET = {
            clientId: "<?php echo esc_js($atts['client_id']); ?>",
            apiEndpoint: "<?php echo esc_js($atts['api_endpoint']); ?>"
        };
        console.log("✅ Homenest Chatbot config loaded:", window.ABC_CHATBOT_WIDGET);
    </script>
    <div id="abc-chatbot-widget"></div>
    <?php
    return ob_get_clean();
});


// ✅ Trang quản trị Dashboard
add_action('admin_menu', function() {
    add_menu_page(
        'Chatbot Client Dashboard',
        'Chatbot Dashboard',
        'manage_options',
        'homenest-chatbot-admin',
        'homenest_chatbot_admin_page',
        'dashicons-admin-users',
        6
    );
});

function homenest_chatbot_admin_page() {
    include plugin_dir_path(__FILE__) . 'admin/admin-page.php';
}
