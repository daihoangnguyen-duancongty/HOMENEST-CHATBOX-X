<?php
/*
Plugin Name: Homenest Chatbot Widget
Description: Chatbot widget cho WordPress + Admin Dashboard quản lý client.
Version: 1.0
Author: You
*/

if (!defined('ABSPATH')) exit; // bảo mật, tránh truy cập trực tiếp

// =======================
// ✅ Enqueue React bundle + CSS
// =======================
add_action('wp_enqueue_scripts', function() {
    // CSS
    wp_enqueue_style(
        'homenest-chatbot-css',
        plugin_dir_url(__FILE__) . 'assets/css/widget.css',
        array(),
        filemtime(plugin_dir_path(__FILE__) . 'assets/css/widget.css') // chống cache
    );

    // JS
    wp_register_script(
        'homenest-chatbot-js',
        plugin_dir_url(__FILE__) . 'assets/js/bundle.js',
        array(),
        filemtime(plugin_dir_path(__FILE__) . 'assets/js/bundle.js'),
        true
    );

    // Lấy clientId từ DB hoặc fallback
    $client_id = get_option('homenest_client_id', 'testclient123');

    // Truyền dữ liệu PHP → JS
    wp_localize_script('homenest-chatbot-js', 'HOMENEST_CHATBOT_WIDGET', array(
        'clientId' => $client_id,
        'apiEndpoint' => 'https://homenest-chatbox-x-production.up.railway.app/api',
        'visitorId' => null
    ));

    // Enqueue script
    wp_enqueue_script('homenest-chatbot-js');
});

// =======================
// ✅ Tự động hiển thị widget ở footer tất cả các page
// =======================
add_action('wp_footer', function() {
    echo do_shortcode('[homenest_chatbot]');
});

// =======================
// ✅ Shortcode để nhúng chatbot vào page/post
// =======================
add_shortcode('homenest_chatbot', function($atts) {
    $atts = shortcode_atts(array(
        'client_id' => get_option('homenest_client_id', 'testclient123'),
        'api_endpoint' => 'https://homenest-chatbox-x-production.up.railway.app/api/chat'
    ), $atts);

    ob_start();
    ?>
    <div id="abc-chatbot-widget"></div>
    <script>
        // Nếu shortcode dùng riêng, fallback
        window.HOMENEST_CHATBOT_WIDGET = window.HOMENEST_CHATBOT_WIDGET || {
            clientId: "<?php echo esc_js($atts['client_id']); ?>",
            apiEndpoint: "<?php echo esc_js($atts['api_endpoint']); ?>",
            visitorId: null
        };
        console.log("✅ Homenest Chatbot config loaded:", window.HOMENEST_CHATBOT_WIDGET);
    </script>
    <?php
    return ob_get_clean();
});

// =======================
// ✅ Trang quản trị Dashboard
// =======================
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

// =======================
// ✅ Admin Page
// =======================
function homenest_chatbot_admin_page() {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['homenest_client_id'])) {
        update_option('homenest_client_id', sanitize_text_field($_POST['homenest_client_id']));
        echo '<div class="notice notice-success is-dismissible"><p>Client ID saved!</p></div>';
    }

    $client_id = get_option('homenest_client_id', 'testclient123');
    ?>
    <div class="wrap">
        <h1>Homenest Chatbot Dashboard</h1>
        <form method="post">
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="homenest_client_id">Client ID</label></th>
                    <td><input type="text" id="homenest_client_id" name="homenest_client_id" value="<?php echo esc_attr($client_id); ?>" class="regular-text"></td>
                </tr>
            </table>
            <?php submit_button('Save Client ID'); ?>
        </form>
        <h2>Shortcode</h2>
        <p>Use <code>[homenest_chatbot]</code> anywhere to embed the chatbot widget.</p>
        <p>Or directly include script in header/footer:</p>
        <pre>
&lt;script&gt;
window.HOMENEST_CHATBOT_WIDGET = window.HOMENEST_CHATBOT_WIDGET || {
  clientId: "<?php echo esc_js($client_id); ?>",
  apiEndpoint: "https://homenest-chatbox-x-production.up.railway.app/api",
  visitorId: null
};
(function() {
  const s = document.createElement('script');
  s.src = "<?php echo esc_js(plugin_dir_url(__FILE__) . 'assets/js/bundle.js'); ?>";
  s.async = true;
  document.head.appendChild(s);
})();
&lt;/script&gt;
        </pre>
    </div>
    <?php
}
