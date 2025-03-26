<?php /* Template Name: Swagger */ ?>
<?php get_header(); ?>
<div id="swagger-ui"></div>
<script>
    window.onload = function () {
        SwaggerUIBundle({
            url: "<?php echo esc_url( home_url( '/docs/openapi.json' ) ); ?>", // Path to the openapi.json in docs folder
            dom_id: "#swagger-ui",
        });
    };
</script>
<?php get_footer(); ?>