<?php

function wp_before_admin_bar_render()
{
}

function remove_menus()
{
    global $post;

    // remove_menu_page("index.php"); //Dashboard

    remove_menu_page("jetpack"); //Jetpack*

    // remove_menu_page("edit.php"); //Posts;

    // remove_menu_page( 'upload.php' );                 //Media

    // remove_menu_page( 'edit.php?post_type=page' );    //Pages

    // remove_menu_page( 'edit-comments.php' );          //Comments

    //remove_menu_page( 'themes.php' );                 //Appearance

    // remove_menu_page( 'plugins.php' );                //Plugins

    // remove_menu_page( 'users.php' );                  //Users

    // remove_menu_page( 'tools.php' );                  //Tools

    // remove_menu_page( 'options-general.php' );        //Settings
}

function prefix_add_footer_styles()
{
    wp_enqueue_script('commons', get_template_directory_uri() . "/js/main.js", array(), filemtime(get_template_directory() . '/js/main.js'), true);
}

function prefix_add_header_styles()
{ 
    wp_enqueue_script(
        "swagger-ui",
        "//cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
        [],
        false,
        false
    );
    wp_enqueue_script(
        "jquery",
        "//cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js",
        [],
        false,
        false
    );   
    wp_enqueue_style(
        "bootstrap-grid",
        "//cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap-grid.min.css",
        [],
        null,
        "all"
    );
    wp_enqueue_style(
        "bootstrap-reboot",
        "//cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap-reboot.min.css",
        [],
        null,
        "all"
    );
    wp_enqueue_style(
        "bootstrap-utilities",
        "//cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap-utilities.min.css",
        [],
        null,
        "all"
    );
    wp_enqueue_style(
        "swagger-ui",
        "//cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
        [],
        null,
        "all"
    );
    wp_enqueue_style('style', get_template_directory_uri() . '/style.css', array(), filemtime(get_template_directory() . '/style.css'));
}

function disable_default_dashboard_widgets()
{
    remove_meta_box("dashboard_right_now", "dashboard", "core");

    remove_meta_box("dashboard_recent_comments", "dashboard", "core");

    remove_meta_box("dashboard_incoming_links", "dashboard", "core");

    remove_meta_box("dashboard_plugins", "dashboard", "core");

    remove_meta_box("dashboard_quick_press", "dashboard", "core");

    remove_meta_box("dashboard_recent_drafts", "dashboard", "core");

    remove_meta_box("dashboard_primary", "dashboard", "core");

    remove_meta_box("dashboard_secondary", "dashboard", "core");
}

if (function_exists("acf_add_options_page")) {
    acf_add_options_page([
        "page_title" => "Theme General Settings",
        "menu_title" => "Theme Settings",
        "menu_slug" => "theme-general-settings",
        "capability" => "edit_posts",
        "redirect" => true,
    ]);
}

function wpb_custom_new_menu()
{
    register_nav_menu("main", __("Main"));
    register_nav_menu("footer", __("Footer"));
}

function atg_menu_classes($classes, $item, $args)
{
    // if($args->theme_location == 'main') {
    //     $classes[] = 'nav-item p-0 ps-5';
    // } elseif($args->theme_location == 'footer') {
    //     $classes[] = 'nav-item nav-col col-6 mb-5 mb-lg-0 pe-5';
    // }
    $classes[] = "nav-item";
    return $classes;
}

function add_menu_link_class($atts, $item, $args)
{
    $atts["class"] = "nav-link";
    return $atts;
}

function acf_to_rest_api($response, $post, $request)
{
    if (function_exists('get_fields') && isset($post->id)) {
        $response->data['acf'] = get_fields($post->id);
    }
    return $response;
}

function ws_register_images_field()
{
    register_rest_field(
        'post',
        'images',
        array(
            'get_callback' => 'ws_get_images_urls',
            'update_callback' => null,
            'schema' => null,
        )
    );
}

function ws_get_images_urls($object, $field_name, $request)
{
    $medium = wp_get_attachment_image_src(get_post_thumbnail_id($object->id), 'medium');
    $medium_url = $medium['0'];

    $large = wp_get_attachment_image_src(get_post_thumbnail_id($object->id), 'large');
    $large_url = $large['0'];

    return array(
        'medium' => $medium_url,
        'large' => $large_url,
    );
}

function create_homepage_on_activation() {
    if (!get_page_by_title('Home')) {
        // Create the home page
        $homepage_id = wp_insert_post([
            'post_title'     => 'Home',
            'post_content'   => 'Welcome to our website!',
            'post_status'    => 'publish',
            'post_type'      => 'page',
            'post_author'    => 1,
            'post_name'      => 'home'
        ]);

        // Set the page as the homepage
        update_option('show_on_front', 'page');
        update_option('page_on_front', $homepage_id);

        // Flush rewrite rules
        flush_rewrite_rules();
    }

    if (!get_page_by_path('swagger')) {
        // Create the page
        $page_data = array(
            'post_title'   => 'Swagger',
            'post_content' => '', // Empty content since the page template will render it
            'post_status'  => 'publish',
            'post_type'    => 'page',
            'post_name'    => 'swagger', // Friendly URL
            'page_template' => 'templates/swagger.php' // Path to the Swagger template
        );
        
        // Insert the page
        wp_insert_post($page_data);
    }

    // Enable support for custom logo
    add_theme_support('custom-logo', array(
        'width'       => 200,  // Optional: default width
        'height'      => 100,  // Optional: default height
        'flex-width'  => true, // Optional: allow flexible width
        'flex-height' => true, // Optional: allow flexible height
    ));
    add_theme_support('title-tag');
}

function remove_homepage_on_deactivation() {
    if (get_page_by_title('Home')) {
        wp_delete_post(get_page_by_title('Home')->ID, true); // Permanently delete the page
    }

    if (get_page_by_path('swagger')) {
        // Delete the page
        wp_delete_post(get_page_by_path('swagger')->ID, true); // true to force delete, not move to trash
    }

    // Reset front page settings
    delete_option('show_on_front');
    delete_option('page_on_front');

    // Flush rewrite rules
    flush_rewrite_rules();
}

function theme_favicon() {
    // Get the URL of the site icon set in the WordPress Customizer
    $favicon_url = get_site_icon_url( 32 ); // You can specify the size (e.g., 32x32)

    // If a site icon is set, output the favicon link
    if ( ! empty( $favicon_url ) ) {
        echo '<link rel="icon" href="' . esc_url( $favicon_url ) . '" sizes="32x32" />' . "\n";
        echo '<link rel="icon" href="' . esc_url( $favicon_url ) . '" sizes="192x192" />' . "\n";
    }
}
add_action('wp_head', 'theme_favicon');
add_action('switch_theme', 'remove_homepage_on_deactivation');
add_action('after_setup_theme', 'create_homepage_on_activation');
add_filter('show_admin_bar', '__return_false');
add_post_type_support('page', 'excerpt');
add_theme_support("post-thumbnails");
add_action('rest_api_init', 'ws_register_images_field');
add_filter("nav_menu_link_attributes", "add_menu_link_class", 1, 3);
add_filter("nav_menu_css_class", "atg_menu_classes", 1, 3);
add_action("get_footer", "prefix_add_footer_styles");
add_action("init", "wpb_custom_new_menu");
add_action("wp_enqueue_scripts", "prefix_add_header_styles");
add_action("admin_menu", "remove_menus");
add_action("admin_menu", "disable_default_dashboard_widgets"); ;