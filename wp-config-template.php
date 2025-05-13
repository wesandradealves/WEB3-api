<?php

define('DB_NAME', getenv('WORDPRESS_DB_NAME'));
define('DB_USER', getenv('WORDPRESS_DB_USER'));
define('DB_PASSWORD', getenv('WORDPRESS_DB_PASSWORD'));
define('DB_HOST', getenv('WORDPRESS_DB_HOST'));
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');

$table_prefix = 'wp_';

define('JWT_AUTH_SECRET_KEY', getenv('JWT_AUTH_SECRET_KEY'));
define('JWT_AUTH_CORS_ENABLE', getenv('JWT_AUTH_CORS_ENABLE'));
define('FS_METHOD', getenv('FS_METHOD'));

define('WP_DEBUG', getenv('WP_DEBUG'));
define('WP_DEBUG_DISPLAY', getenv('WP_DEBUG_DISPLAY'));
define('WP_MEMORY_LIMIT', getenv('WP_MEMORY_LIMIT'));
define('WP_MAX_MEMORY_LIMIT', getenv('WP_MAX_MEMORY_LIMIT'));
define('WP_DEBUG_LOG', getenv('WP_DEBUG_LOG'));
define('WP_ALLOW_REPAIR', getenv('WP_ALLOW_REPAIR'));

if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}

require_once ABSPATH . 'wp-settings.php';
