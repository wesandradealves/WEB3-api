<?php
/*
 * Plugin Name: Polylang REST Header
 * Description: Permite definir o idioma do Polylang via header nas requisições REST (X-Language ou Accept-Language).
 * Version: 1.2
 * Author: Dourado Cash
 * Author URI: https://dourado.cash/
 */

if (!defined('ABSPATH')) exit;

add_action('rest_api_init', function() {
    $available_langs = function_exists('pll_languages_list') ? pll_languages_list() : ['pt'];

    $header_lang = null;
    if (!empty($_SERVER['HTTP_X_LANGUAGE'])) {
        $header_lang = strtolower(sanitize_text_field($_SERVER['HTTP_X_LANGUAGE']));
    } 
    
    if ($header_lang && in_array($header_lang, $available_langs, true)) {
        if (function_exists('pll_switch_lang')) {
            pll_switch_lang($header_lang);
        }
        $post_types = get_post_types(['public' => true], 'names');
        foreach ($post_types as $type) {
            add_filter("rest_{$type}_query", function($args) use ($header_lang, $type) {
                error_log("REST Query for type: {$type} | lang: {$header_lang}");
                $args['lang'] = $header_lang;
                return $args;
            });
        }
    }
}, 0);


add_action('rest_api_init', function () {
    $lang = $_SERVER['HTTP_X_LANGUAGE'] ?? 'not set';
    error_log('X-Language: ' . $lang);
});