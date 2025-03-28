<?php get_header(); ?>
<div id="wrap" class="d-flex justify-content-center align-items-center p-5 vh-100 w-100 bg-black">

    <?php
        if (has_custom_logo()) {
            the_custom_logo(); // Displays the custom logo
        } else {
            // Fallback: Site name if no custom logo is set
            echo '<a href="' . esc_url(home_url('/')) . '" class="site-title">' . get_bloginfo('name') . '</a>';
        }
    ?>

</div>
<?php get_footer(); ?>