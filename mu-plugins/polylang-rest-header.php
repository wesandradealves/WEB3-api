<?php
/*
 * Plugin Name: Polylang REST Header
 * Description: Permite definir o idioma do Polylang via header nas requisições REST (X-Language ou Accept-Language).
 * Version: 1.2
 * Author: Dourado Cash
 * Author URI: https://dourado.cash/
 */

if (!defined('ABSPATH')) exit;

add_filter('rest_request_before_callbacks', function($response, $handler, $request) {
    if ($request instanceof WP_REST_Request && empty($request->get_param('lang'))) {
        $lang = null;
        if (!empty($_SERVER['HTTP_X_LANGUAGE'])) {
            $lang = strtolower(sanitize_text_field($_SERVER['HTTP_X_LANGUAGE']));
        } elseif (!empty($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
            $langs = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
            $lang = substr($langs[0], 0, 2);
        }
        if ($lang && in_array($lang, ['pt', 'en'])) {
            $request->set_param('lang', $lang);
        }
    }
    return $response;
}, 0, 3);
