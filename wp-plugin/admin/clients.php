<?php
if (!defined('ABSPATH')) exit;

// ======= SYNC FUNCTION =======
function abc_chatbot_sync_to_backend($action, $client_array) {
  $endpoint = get_option('abc_chatbot_api_endpoint', '');
  $token = get_option('abc_chatbot_admin_token', '');

  if (empty($endpoint) || empty($token)) {
    error_log('[ABC Chatbot] Missing API endpoint or token.');
    return ['ok' => false, 'error' => 'Missing API endpoint or token.'];
  }

  $url = rtrim($endpoint, '/') . '/admin-api/clients';
  $body = wp_json_encode(['action' => $action, 'client' => $client_array]);
  $args = [
    'headers' => [
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $token,
    ],
    'body' => $body,
    'timeout' => 15,
  ];

  $resp = wp_remote_post($url, $args);
  if (is_wp_error($resp)) {
    error_log('[ABC Chatbot] sync_to_backend error: ' . $resp->get_error_message());
    return ['ok' => false, 'error' => $resp->get_error_message()];
  }

  $code = wp_remote_retrieve_response_code($resp);
  $body = wp_remote_retrieve_body($resp);

  if ($code >= 200 && $code < 300) {
    return ['ok' => true, 'response' => json_decode($body, true)];
  } else {
    error_log("[ABC Chatbot] sync_to_backend HTTP $code body: $body");
    return ['ok' => false, 'error' => "HTTP $code", 'body' => $body];
  }
}

// ======= MAIN CLIENT PAGE =======
function abc_chatbot_clients_page() {
  global $wpdb;
  $table = $wpdb->prefix . 'abc_chatbot_clients';

  // CREATE CLIENT
  if (isset($_POST['create_client']) && check_admin_referer('abc_chatbot_create_client')) {
    $name = sanitize_text_field($_POST['name']);
    $domain = sanitize_text_field($_POST['domain']);
    $color = sanitize_text_field($_POST['color']);
    $welcome = sanitize_text_field($_POST['welcome']);
    $ai_provider = sanitize_text_field($_POST['ai_provider']);

    $client_id = bin2hex(random_bytes(16));

    $wpdb->insert($table, [
      'client_id' => $client_id,
      'name' => $name,
      'domain' => $domain,
      'color' => $color,
      'welcome_message' => $welcome,
      'ai_provider' => $ai_provider
    ]);

    // === SYNC TO BACKEND ===
    $client_array = [
      'clientId' => $client_id,
      'name' => $name,
      'domain' => $domain,
      'color' => $color,
      'welcome_message' => $welcome,
      'ai_provider' => $ai_provider,
    ];
    $result = abc_chatbot_sync_to_backend('create', $client_array);
    if (!$result['ok']) {
      echo '<div class="notice notice-warning"><p><strong>Warning:</strong> Sync to backend failed — ' . esc_html($result['error']) . '</p></div>';
    } else {
      echo '<div class="updated"><p>Client created and synced successfully. ID: <code>' . esc_html($client_id) . '</code></p></div>';
    }
  }

  // DELETE CLIENT
  if (isset($_GET['delete'])) {
    $del = intval($_GET['delete']);
    $client = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table WHERE id=%d", $del));
    if ($client) {
      $client_array = ['clientId' => $client->client_id, 'name' => $client->name];
      abc_chatbot_sync_to_backend('delete', $client_array);
    }
    $wpdb->delete($table, ['id' => $del]);
    echo '<div class="updated"><p>Client deleted.</p></div>';
  }

  // FETCH ALL
  $clients = $wpdb->get_results("SELECT * FROM $table ORDER BY created_at DESC");

  ?>
  <div class="wrap">
    <h1>ABC Chatbot Clients</h1>
    <div style="display:flex; gap:24px;">
      <div style="flex:1;">
        <h2>Create new client</h2>
        <form method="post">
          <?php wp_nonce_field('abc_chatbot_create_client'); ?>
          <table class="form-table">
            <tr><th>Name</th><td><input type="text" name="name" class="regular-text" required></td></tr>
            <tr><th>Domain</th><td><input type="text" name="domain" class="regular-text"></td></tr>
            <tr><th>Color</th><td><input type="color" name="color" value="#0b74ff"></td></tr>
            <tr><th>Welcome message</th><td><input type="text" name="welcome" class="regular-text" value="Xin chào! Mình có thể giúp gì?"></td></tr>
            <tr><th>AI Provider</th>
              <td>
                <select name="ai_provider">
                  <option value="openai">OpenAI</option>
                  <option value="claude">Claude</option>
                  <option value="gemini">Gemini</option>
                </select>
              </td>
            </tr>
          </table>
          <p><input type="submit" name="create_client" class="button button-primary" value="Create client"></p>
        </form>
      </div>

      <div style="flex:2;">
        <h2>Client list</h2>
        <table class="widefat fixed">
          <thead><tr><th>Client ID</th><th>Name</th><th>Domain</th><th>AI</th><th>Color</th><th>Actions</th></tr></thead>
          <tbody>
            <?php foreach ($clients as $c): ?>
            <tr>
              <td><code><?php echo esc_html($c->client_id); ?></code></td>
              <td><?php echo esc_html($c->name); ?></td>
              <td><?php echo esc_html($c->domain); ?></td>
              <td><?php echo esc_html($c->ai_provider); ?></td>
              <td><span style="display:inline-block;width:32px;height:20px;background:<?php echo esc_attr($c->color); ?>;border:1px solid #ccc;"></span></td>
              <td>
                <button class="button" onclick="prompt('Embed script for this client', `<script src='https://cdn.yourdomain/widget.js' data-client-id='<?php echo esc_js($c->client_id); ?>'></script>`)">Get script</button>
                <a class="button" href="admin.php?page=abc-chatbot-clients&delete=<?php echo intval($c->id); ?>" onclick="return confirm('Delete this client?')">Delete</a>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <?php
}
