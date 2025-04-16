<?php
/**
 * Plugin Name:       BDM Firebase BFF
 * Plugin URI:        https://dourado.cash/
 * Description:       Integração com Firebase via REST API usando WordPress como BFF.
 * Version:           1.0.0
 * Author:            Dourado Cash
 * Author URI:        https://dourado.cash/
 * License:           GPL-2.0+
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       bdm-firebase-bff
 * Domain Path:       /languages
 */

defined('ABSPATH') || exit;

// Autoload Composer
require_once plugin_dir_path(__FILE__) . 'vendor/autoload.php';

// Inicializa o endpoint de analytics
use BDM\FirebaseBFF\Rest\AnalyticsEndpoint;

AnalyticsEndpoint::register();
