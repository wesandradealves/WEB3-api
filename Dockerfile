# Use the WordPress base image with PHP 8.2
FROM wordpress:php8.2-apache

# Ensure the /var/www/html directory exists
RUN mkdir -p /var/www/html && chown -R www-data:www-data /var/www/html

# Install system dependencies and PHP extensions required for Composer, WP-CLI, and Node.js
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    git \
    nano \
    libpng-dev \
    libxml2-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libzip-dev \
    ca-certificates \
    nodejs \
    npm \
    dos2unix \
    && docker-php-ext-configure gd \
    && docker-php-ext-install gd zip soap \
    && rm -rf /var/lib/apt/lists/*

# Install Composer globally inside the container
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install WP-CLI globally
RUN curl -sS https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o /usr/local/bin/wp \
    && chmod +x /usr/local/bin/wp

# Remove default WordPress files from the image
RUN rm -rf /var/www/html/*

# Set the working directory to the WordPress root directory
WORKDIR /var/www/html

# Copy composer.json into the container
COPY composer.json /var/www/html/composer.json

# Allow all plugins to be used
RUN composer config --no-plugins allow-plugins.* true

# Allow johnpbloch/wordpress-core-installer explicitly
RUN composer config --global allow-plugins.johnpbloch/wordpress-core-installer true

# Install WordPress via Composer (this will install WordPress in the container's wp-content)
RUN composer install

# Ensure proper permissions on the plugin files
RUN chown -R www-data:www-data /var/www/html/wp-content/plugins && \
    chmod -R 755 /var/www/html/wp-content/plugins

# Ensure proper permissions on the theme files
RUN chown -R www-data:www-data /var/www/html/wp-content/themes && \
    chmod -R 755 /var/www/html/wp-content/themes

# Copy Plugins in a single command
COPY ./classic-editor /var/www/html/wp-content/plugins/classic-editor
COPY ./acf-to-rest-api /var/www/html/wp-content/plugins/acf-to-rest-api
COPY ./advanced-custom-fields-pro /var/www/html/wp-content/plugins/advanced-custom-fields-pro
COPY ./wp-rest-api-controller /var/www/html/wp-content/plugins/wp-rest-api-controller
COPY ./wp-openapi /var/www/html/wp-content/plugins/wp-openapi
COPY ./jwt-authentication-for-wp-rest-api /var/www/html/wp-content/plugins/jwt-authentication-for-wp-rest-api
COPY ./wp-rest-cache /var/www/html/wp-content/plugins/wp-rest-cache
COPY ./quick-featured-images /var/www/html/wp-content/plugins/quick-featured-images
COPY ./bdm-firebase-bff /var/www/html/wp-content/plugins/bdm-firebase-bff

# Copy Theme
COPY ./bdm-digital-website-api-theme /var/www/html/wp-content/themes/bdm-digital-website-api-theme

# Ensure proper permissions before deleting unwanted plugins
RUN chmod -R 777 /var/www/html/wp-content/plugins && \
    ls -lah /var/www/html/wp-content/plugins && \
    rm -rf /var/www/html/wp-content/plugins/hello.php /var/www/html/wp-content/plugins/hello-dolly /var/www/html/wp-content/plugins/akismet

# Copy the .env file into the container
COPY .env /var/www/.env

# Copy Swagger UI
COPY ./docs /var/www/html/docs

# Remove default WordPress files from the image
RUN rm -rf /var/www/html/wordpress

# Ensure the uploads directory exists and is writable
RUN mkdir -p /var/www/html/wp-content/uploads && \
    chown -R www-data:www-data /var/www/html  && \
    chmod -R 755 /var/www/html  && \
    chown -R www-data:www-data /var/www/html/wp-content/uploads && \
    chmod -R 775 /var/www/html/wp-content/uploads && \
    chmod -R 775 wp-content && \
    chmod -R 775 wp-admin

RUN composer update

# SQL inicial
COPY ./dumps/wordpress_db.sql /docker-entrypoint-initdb.d/
RUN chmod 644 /docker-entrypoint-initdb.d/wordpress_db.sql

# Arquivos de configuração
COPY ./setup-wp-config.sh /usr/local/bin/setup-wp-config.sh
RUN dos2unix /usr/local/bin/setup-wp-config.sh && chmod +x /usr/local/bin/setup-wp-config.sh

COPY ./init-db.sh /usr/local/bin/init-db.sh
RUN dos2unix /usr/local/bin/init-db.sh && chmod +x /usr/local/bin/init-db.sh

# Instalar o cliente MySQL
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

# Copiar o script de inicialização para o contêiner
COPY ./init-db.sh /usr/local/bin/init-db.sh

# Tornar o script executável
RUN chmod +x /usr/local/bin/init-db.sh

# Expose port 80
EXPOSE 80

# Entrypoint final
ENTRYPOINT ["/bin/bash", "-c", "/usr/local/bin/setup-wp-config.sh && docker-entrypoint.sh apache2-foreground"]