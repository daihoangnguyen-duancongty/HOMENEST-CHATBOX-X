<?php
if (!defined('ABSPATH')) exit;

function abc_chatbot_settings_page() {
  if (isset($_POST['save_settings']) && check_admin_referer('abc_chatbot_save_settings')) {
    update_option('abc_chatbot_api_endpoint', sanitize_text_field($_POST['api_endpoint']));
    update_option('abc_chatbot_admin_token', sanitize_text_field($_POST['admin_token']));
    update_option('abc_chatbot_global_secret', sanitize_text_field($_POST['global_secret']));
    echo '<div class="updated"><p>Settings saved.</p></div>';
  }

  $api_endpoint = get_option('abc_chatbot_api_endpoint', '');
  $admin_token = get_option('abc_chatbot_admin_token', '');
  $global_secret = get_option('abc_chatbot_global_secret', '');
  ?>
  <div class="wrap">
    <h1>ABC Chatbot Settings</h1>
    <form method="post">
      <?php wp_nonce_field('abc_chatbot_save_settings'); ?>
      <table class="form-table">
        <tr>
          <th scope="row">API Endpoint</th>
          <td><input type="text" name="api_endpoint" value="<?php echo esc_attr($api_endpoint); ?>" class="regular-text" placeholder="https://api.yourdomain.com"></td>
        </tr>
        <tr>
          <th scope="row">Admin Sync Token</th>
          <td>
            <input type="text" name="admin_token" value="<?php echo esc_attr($admin_token); ?>" class="regular-text">
            <p class="description">Used by WP admin to sync clients to backend. Keep this secret.</p>
          </td>
        </tr>
        <tr>
          <th scope="row">Global Secret (optional)</th>
          <td><input type="text" name="global_secret" value="<?php echo esc_attr($global_secret); ?>" class="regular-text"></td>
        </tr>
      </table>
      <p><input type="submit" name="save_settings" class="button button-primary" value="Save Settings"></p>
    </form>
  </div>
  <?php
}
