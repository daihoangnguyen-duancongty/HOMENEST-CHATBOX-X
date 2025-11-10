<?php
/*
Plugin Name: ABC Chatbot (Admin)
Description: Dashboard quản lý clients cho ABC Chatbot — tạo client_id, chỉnh theme, export & auto-sync backend.
Version: 1.2
Author: ABC Tech
*/

if (!defined('ABSPATH')) exit;

// === Database Setup ===
register_activation_hook(__FILE__, 'abc_chatbot_activate');
function abc_chatbot_activate() {
  global $wpdb;
  $table = $wpdb->prefix . 'abc_chatbot_clients';
  $charset_collate = $wpdb->get_charset_collate();

  $sql = "CREATE TABLE $table (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    client_id VARCHAR(64) NOT NULL,
    name VARCHAR(191) NOT NULL,
    domain VARCHAR(191) DEFAULT NULL,
    color VARCHAR(7) DEFAULT '#0b74ff',
    logo_url TEXT DEFAULT NULL,
    welcome_message VARCHAR(255) DEFAULT NULL,
    ai_provider VARCHAR(50) DEFAULT 'openai',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY client_id (client_id)
  ) $charset_collate;";

  require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
  dbDelta($sql);
}

// === Admin Menu ===
add_action('admin_menu', 'abc_chatbot_admin_menu');
function abc_chatbot_admin_menu() {
  add_menu_page('ABC Chatbot', 'ABC Chatbot', 'manage_options', 'abc-chatbot', 'abc_chatbot_clients_page', 'dashicons-format-chat', 56);
  add_submenu_page('abc-chatbot', 'Clients', 'Clients', 'manage_options', 'abc-chatbot-clients', 'abc_chatbot_clients_page');
  add_submenu_page('abc-chatbot', 'Settings', 'Settings', 'manage_options', 'abc-chatbot-settings', 'abc_chatbot_settings_page');
}

// === Includes ===
require_once plugin_dir_path(__FILE__) . 'admin/settings.php';
require_once plugin_dir_path(__FILE__) . 'admin/clients.php';
