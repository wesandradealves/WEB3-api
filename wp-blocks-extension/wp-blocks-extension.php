<?php
/**
 * Plugin Name: WP Blocks Custom Extension
 * Description: WP Blocks Custom Extension for Rest API and Custom Blocks Creation
 * Version: 1.0.0
 * Author: Wesley Alves
 */

// Enqueue block editor assets
function wp_blocks_custom_extension_assets() {
    wp_enqueue_script(
        'wp-blocks-custom-extension-js', // Handle for script
        plugin_dir_url( __FILE__ ) . 'blocks.js', // Path to your JavaScript file
        array( 'wp-blocks', 'wp-element', 'wp-editor' ), // Dependencies
        filemtime( plugin_dir_path( __FILE__ ) . 'blocks.js' ),
        true
    );
}
add_action( 'enqueue_block_editor_assets', 'wp_blocks_custom_extension_assets' );

function register_hero_block() {
    register_block_type( 'wp/custom-hero', array(
        'editor_script' => 'wp-blocks-custom-extension-js',
        'render_callback' => 'render_hero_block', // Optional: custom render callback for dynamic blocks
    ));
}
add_action( 'init', 'register_hero_block' );

function render_hero_block( $attributes ) {
    return '<div class="custom-hero-block">Your Hero Block Content</div>';
}
