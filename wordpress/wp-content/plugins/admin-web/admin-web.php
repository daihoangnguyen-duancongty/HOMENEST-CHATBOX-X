<?php
/*
Plugin Name: Admin Web Dashboard
Description: Admin dashboard React/Tailwind build thành plugin WordPress
Version: 1.0
Author: You
*/

if (!defined('ABSPATH')) exit;

// Enqueue JS + CSS
add_action('admin_enqueue_scripts', function() {
    $plugin_url = plugin_dir_url(__FILE__);

    wp_enqueue_script(
        'admin-web-bundle',
        $plugin_url . 'assets/js/bundle.js',
        [], // dependencies
        filemtime(plugin_dir_path(__FILE__) . 'assets/js/bundle.js'),
        true
    );

    wp_enqueue_style(
        'admin-web-css',
        $plugin_url . 'assets/css/style.css',
        [],
        filemtime(plugin_dir_path(__FILE__) . 'assets/css/style.css')
    );
});
