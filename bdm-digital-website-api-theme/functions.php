<?php

// Renderizar estilos no admin
function wp_before_admin_bar_render()
{
}

// Remover menus do menu lateral

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
    // wp_enqueue_script('commons', get_template_directory_uri() . "/assets/js/main.js", array(), filemtime(get_template_directory() . '/assets/js/main.js'), true);
}

// Carregar scripts uteis para uso no tema

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

// Desabilitar widget default do WP na UI principal do admin (dashboard)

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

// Option page para o acf (paginas customizadas no menu lateral)

if (function_exists("acf_add_options_page")) {
    // acf_add_options_page([
    //     "page_title" => "Theme General Settings",
    //     "menu_title" => "Theme Settings",
    //     "menu_slug" => "theme-general-settings",
    //     "capability" => "edit_posts",
    //     "redirect" => true,
    // ]);
}

// Registrar menus

function wpb_custom_new_menu()
{
    register_nav_menu("main", __("Main"));
    register_nav_menu("footer", __("Footer"));
    register_nav_menu("lateral", __("Lateral"));
}

// Classes para menu e link customizadas

function atg_menu_classes($classes, $item, $args)
{
    $classes[] = "nav-item";
    return $classes;
}

function add_menu_link_class($atts, $item, $args)
{
    $atts["class"] = "nav-link";
    return $atts;
}

// Expor ACF fields na Rest API

function acf_to_rest_api($response, $post, $request)
{
    if (function_exists('get_fields') && isset($post->ID)) {
        $fields = get_fields($post->ID); // Get all ACF fields for the post
        $field_groups = acf_get_field_groups(['post_id' => $post->ID]); // Get all field groups for the post

        $grouped_fields = [];
        $used_fields = []; // Track fields that have been grouped

        foreach ($field_groups as $group) {
            $group_name = $group['title']; // Field group name
            $group_key = $group['key'];   // Field group key
            $group_fields = [];

            foreach ($fields as $key => $value) {
                $field = get_field_object($key); // Get field object for each field
                if ($field && isset($field['group']) && $field['group'] === $group_key) {
                    $group_fields[$key] = $value; // Add field to the group if it matches
                    $used_fields[] = $key; // Mark the field as used
                }
            }

            if (!empty($group_fields)) {
                $grouped_fields[$group_name] = $group_fields; // Add non-empty groups to the response
            }
        }

        // Remove fields that have already been grouped
        foreach ($used_fields as $used_field) {
            unset($fields[$used_field]);
        }

        // Add grouped fields to the response
        $response->data['acf'] = $grouped_fields;
    }

    return $response;
}

// Supoerte a image field nativa / featured image na rest api

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

// Executar ao ativar otema

function create_homepage_on_activation()
{
    // Criar página home e incluir o template swagger
    if (!get_page_by_title('Home')) {
        $homepage_id = wp_insert_post([
            'post_title' => 'Documentation',
            'post_content' => '',
            'post_status' => 'publish',
            'post_type' => 'page',
            'post_author' => 1,
            'post_name' => 'home',
            'page_template' => 'templates/swagger.php'
        ]);

        update_option('show_on_front', 'page');
        update_option('page_on_front', $homepage_id);

        flush_rewrite_rules();
    }

    // Adicionar suporte a tag title e custom logo

    add_theme_support('custom-logo', array(
        'width' => 200, 
        'height' => 100,  
        'flex-width' => true,
        'flex-height' => true,
    ));
    add_theme_support('title-tag');
}

// Remoção da pãgina home/swagger ao desativar o tema

function remove_homepage_on_deactivation()
{
    if (get_page_by_title('Home')) {
        wp_delete_post(get_page_by_title('Home')->ID, true);
    }

    delete_option('show_on_front');
    delete_option('page_on_front');

    flush_rewrite_rules();
}


// Adição de suporte ao favicon

function theme_favicon()
{
    $favicon_url = get_site_icon_url(32); 

    if (!empty($favicon_url)) {
        echo '<link rel="icon" href="' . esc_url($favicon_url) . '" sizes="32x32" />' . "\n";
        echo '<link rel="icon" href="' . esc_url($favicon_url) . '" sizes="192x192" />' . "\n";
    }
}

// Rest Services

function get_menu_by_slug($request)
{
    $menu_slug = $request->get_param('slug');
    $menu = wp_get_nav_menu_object($menu_slug);

    if (!$menu) {
        return new WP_Error('menu_not_found', 'Menu not found', array('status' => 404));
    }

    $menu_items = wp_get_nav_menu_items($menu->term_id);

    if (empty($menu_items)) {
        return rest_ensure_response([]);
    }

    $menu_tree = [];
    $items_by_id = [];

    foreach ($menu_items as $item) {
        $item->children = [];
        $item->acf = function_exists('get_fields') ? get_fields($item->ID) : null; // Add ACF fields
        $items_by_id[$item->ID] = $item;
    }

    foreach ($menu_items as $item) {
        if ($item->menu_item_parent == 0) {
            $menu_tree[] = $item; 
        } else {
            if (isset($items_by_id[$item->menu_item_parent])) {
                $items_by_id[$item->menu_item_parent]->children[] = $item;
            }
        }
    }

    return rest_ensure_response($menu_tree);
}

function register_menu_slug_endpoint()
{
    register_rest_route('custom/v1', '/menus', array(
        'methods' => 'GET',
        'callback' => 'get_menu_by_slug',
        'args' => array(
            'slug' => array(
                'required' => true,
                'validate_callback' => function ($param) {
                    return is_string($param);
                }
            )
        ),
        'permission_callback' => '__return_true',
    ));
}

// Fields no Form de Settings
function settings_form($wp_customize)
{
    $wp_customize->add_section('social_networks_section', array(
        'title' => __('Social Networks', 'theme_textdomain'),
        // 'description' => __('Add your social network links here.', 'theme_textdomain'),
        'priority' => 160, 
    ));

    $social_networks = ['Facebook', 'Twitter', 'Instagram', 'Linkedin', 'YouTube'];

    foreach ($social_networks as $network) {
        $setting_id = strtolower($network);

        $wp_customize->add_setting($setting_id, array(
            'default' => '',
            'sanitize_callback' => 'esc_url_raw',
        ));

        $wp_customize->add_control($setting_id, array(
            'label' => sprintf(__('%s URL', 'theme_textdomain'), $network),
            'section' => 'social_networks_section',
            'type' => 'url',
        ));
    }
}

function register_settings_endpoint()
{
    register_rest_route('custom/v1', '/settings', array(
        'methods' => 'GET',
        'callback' => 'settings',
        'permission_callback' => '__return_true', 
    ));
}

function settings()
{
    $response = array(
        'social_networks' => array(
            array(
                'title' => 'Facebook',
                'url' => get_theme_mod('facebook', ''),
            ),
            array(
                'title' => 'Twitter',
                'url' => get_theme_mod('twitter', ''),
            ),
            array(
                'title' => 'Instagram',
                'url' => get_theme_mod('instagram', ''),
            ),
            array(
                'title' => 'LinkedIn',
                'url' => get_theme_mod('linkedin', ''),
            ),
            array(
                'title' => 'YouTube',
                'url' => get_theme_mod('youtube', ''),
            ),
        ),
        'custom_logo' => get_theme_mod('custom_logo') ? wp_get_attachment_image_src(get_theme_mod('custom_logo'), 'full')[0] : '',
        'favicon'     => get_site_icon_url(),    
        'blog_info'   => array(        
            'name'        => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'url'         => get_bloginfo('url'),
            'admin_email' =>  get_bloginfo('admin_email'),
        ),
    );

    return rest_ensure_response($response);
}

// Adição de cores para o editor de texto

function customize_acf_wysiwyg_colors($init) {
    $custom_colors = '
        "000000", "Black",
        "FFFFFF", "White",
        "FFC700", "Yellow",
    ';

    $init['textcolor_map'] = '[' . $custom_colors . ']';
    $init['textcolor_rows'] = 1; 

    return $init;
}

function customize_acf_wysiwyg_toolbar($toolbars) {
    $toolbars['Custom'] = array();
    $toolbars['Custom'][1] = array(
        'formatselect', 'bold', 'italic', 'underline', 'bullist', 'numlist', 'blockquote', 
        'alignleft', 'aligncenter', 'alignright', 'link', 'unlink', 'forecolor', 'backcolor'
    );

    if (isset($toolbars['Full'])) {
        $toolbars['Full'] = $toolbars['Custom'];
    }

    return $toolbars;
}

// #

add_filter('tiny_mce_before_init', 'customize_acf_wysiwyg_colors');
add_filter('acf/fields/wysiwyg/toolbars', 'customize_acf_wysiwyg_toolbar');
add_filter('rest_prepare_post', 'acf_to_rest_api', 10, 3);
add_action('rest_api_init', 'register_settings_endpoint');
add_action('customize_register', 'settings_form');
add_action('rest_api_init', 'register_menu_slug_endpoint');
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
add_action("admin_menu", "disable_default_dashboard_widgets");

// Blocks

function my_custom_block_category($categories, $post) {
    return array_merge(
        array(
            array(
                'slug'  => 'rest-api',
                'title' => __('Rest API', 'bdm-digital-website-api-theme'),
                'icon'  => null,
            ),
        ),
        $categories
    );
}
add_filter('block_categories_all', 'my_custom_block_category', 10, 2);

function my_acf_blocks_init() {
    if( function_exists('acf_register_block_type') ) {
        $blocks = [
            (object) [
                'name'        => 'hero',
                'title'       => __('Hero'),
                'description' => __('Hero Component'),
                'category'    => 'rest-api',
                'icon'        => '',
                'keywords'    => ['hero', 'acf', 'rest'],
                'supports'    => [
                    'align' => true,
                    'jsx'   => true, 
                ],
            ],
            (object) [
                'name'        => 'section',
                'title'       => __('Media Section'),
                'description' => __('Section Component'),
                'category'    => 'rest-api',
                'icon'        => '',
                'keywords'    => ['section', 'acf', 'rest'],
                'supports'    => [
                    'align' => true,
                    'jsx'   => true, 
                ],
            ],
            (object) [
                'name'        => 'boxes',
                'title'       => __('Boxes Section'),
                'description' => __('Section Boxes Component'),
                'category'    => 'rest-api',
                'icon'        => '',
                'keywords'    => ['section', 'acf', 'rest'],
                'supports'    => [
                    'align' => true,
                    'jsx'   => true, 
                ],
            ]
        ];

        foreach ($blocks as $block) {
            acf_register_block_type(array(
                'name'              => $block->name,
                'title'             => $block->title,
                'description'       => $block->description,
                'render_template'   => get_template_directory() . '/templates/blocks.php',
                'category'          => $block->category,
                'icon'              => $block->icon,
                'keywords'          => $block->keywords,
                'supports'          => $block->supports,
            ));
        }
    }
}
add_action('acf/init', 'my_acf_blocks_init');

// Rest Services

function expose_gutenberg_blocks_to_rest($response, $post, $request) {
    if (empty($post->post_content)) {
        return $response;
    }

    $blocks = parse_blocks($post->post_content);
    $structured_blocks = [];

    foreach ($blocks as $index => $block) {
        if (!isset($block['blockName'])) {
            continue; 
        }

        $attrs = isset($block['attrs']) ? $block['attrs'] : [];

        if (strpos($block['blockName'], 'acf/') === 0) {
            $acf_fields = get_fields($post->ID);
            $attrs['acf'] = $acf_fields ?: [];
        }

        $structured_blocks[] = [
            'id'            => $index + 1,
            'type'          => $block['blockName'],
            'machine_name'          => str_replace('acf/', '', $block['blockName']),
            'attrs'         => $attrs, 
            'innerContent'  => $block['innerContent'] ?? [],
        ];
    }

    $response->data['acf_blocks'] = $structured_blocks;

    return $response;
}

add_filter('rest_prepare_page', 'expose_gutenberg_blocks_to_rest', 10, 3);
