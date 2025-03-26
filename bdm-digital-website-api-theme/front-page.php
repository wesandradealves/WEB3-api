<?php
    get_header();
    if (has_custom_logo()) {
        the_custom_logo(); // Displays the custom logo
    } else {
        // Fallback: Site name if no custom logo is set
        echo '<a href="' . esc_url(home_url('/')) . '" class="site-title">' . get_bloginfo('name') . '</a>';
    }
    get_footer();
?>