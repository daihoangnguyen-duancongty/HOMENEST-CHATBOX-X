<?php
/*
Plugin Name: Homenest Client Dashboard
Description: Dashboard quản lý client cho ABC Chatbot.
Version: 1.0
Author: You
*/

if (!defined('ABSPATH')) exit;

add_action('admin_menu', function(){
    add_menu_page('Client Dashboard','Client Dashboard','manage_options','homenest-client-dashboard','homenest_client_dashboard_page','dashicons-admin-users',6);
});

function homenest_client_dashboard_page(){
    ?>
    <div class="wrap">
        <h1>Client Dashboard</h1>
        <form method="post">
            <table class="form-table">
                <tr><th>Client ID</th><td><input type="text" name="clientId" required></td></tr>
                <tr><th>Name</th><td><input type="text" name="name"></td></tr>
                <tr><th>Color</th><td><input type="text" name="color" placeholder="#0b74ff"></td></tr>
                <tr><th>AI Provider</th><td>
                    <select name="ai_provider">
                        <option value="openai">OpenAI</option>
                        <option value="claude">Claude</option>
                        <option value="gemini">Gemini</option>
                    </select>
                </td></tr>
            </table>
            <input type="submit" name="homenest_submit" class="button button-primary" value="Update Client">
        </form>
        <hr>
        <?php if(isset($_POST['homenest_submit'])) homenest_update_client($_POST); ?>
    </div>
    <?php
}

function homenest_update_client($data){
    $payload = [
        'action'=>'update',
        'client'=>[
            'clientId'=>sanitize_text_field($data['clientId']),
            'name'=>sanitize_text_field($data['name']),
            'color'=>sanitize_text_field($data['color']),
            'ai_provider'=>sanitize_text_field($data['ai_provider'])
        ]
    ];

    $ch = curl_init('homenest-chatbox-x-production.up.railway.app');
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST,'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER,true);
    curl_setopt($ch, CURLOPT_HTTPHEADER,['Content-Type: application/json']);
    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if($err) echo "<p style='color:red'>CURL Error: $err</p>";
    else echo "<p style='color:green'>Response: $response</p>";
}
?>
