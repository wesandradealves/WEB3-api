<?php

namespace BDM\FirebaseBFF\Rest;

use BDM\FirebaseBFF\Analytics\GA4Service;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

class AnalyticsEndpoint
{
    public static function register(): void
    {
        add_action('rest_api_init', function () {
            register_rest_route('bdm/v1', '/analytics', [
                'methods'  => 'GET',
                'callback' => [self::class, 'handle'],
                'permission_callback' => '__return_true',
            ]);
        });
    }

    public static function handle(WP_REST_Request $request): WP_REST_Response|WP_Error
    {
        $credentialsPath = plugin_dir_path(__DIR__, 2) . '../firebase/firebase_credentials.json';
        $propertyId = '308173741'; //308173741 //485798021
        

        if (empty($credentialsPath) || !file_exists($credentialsPath)) {
            return new WP_Error('missing_credentials', 'Credenciais não encontradas.', ['status' => 500]);
        }

        try {
            $ga4 = new GA4Service($credentialsPath, $propertyId);
            $data = $ga4->fetchAnalytics();
            return rest_ensure_response($data);
        } catch (\Throwable $e) {
            return new WP_Error('analytics_error', $e->getMessage(), ['status' => 500]);
        }
    }
}
