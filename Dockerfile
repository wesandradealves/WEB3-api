# Base image
FROM wordpress:php8.2-apache

# Criar diretório e ajustar permissões
RUN mkdir -p /var/www/html && chown -R www-data:www-data /var/www/html

# Instalar dependências do sistema e extensões PHP
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
    docker-compose \
    libcurl4-openssl-dev \
    nodejs \
    default-mysql-client \
    npm \
    dos2unix \
  && docker-php-ext-configure gd \
  && docker-php-ext-install gd zip soap \
  && rm -rf /var/lib/apt/lists/*

# Composer
ENV COMPOSER_ROOT_VERSION=6.7.2
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# WP-CLI
RUN curl -sS https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o /usr/local/bin/wp \
    && chmod +x /usr/local/bin/wp

# Remover arquivos padrão do WordPress
RUN rm -rf /var/www/html/*

# WordPress install location
WORKDIR /var/www/html

# Composer setup
COPY composer.json ./
RUN chmod 664 composer.json
RUN php -d memory_limit=-1 /usr/local/bin/wp core download --allow-root --locale=pt_BR --path=/var/www/html

RUN composer require vlucas/phpdotenv && \
    composer config --no-plugins allow-plugins.* true && \
    composer config --global allow-plugins.johnpbloch/wordpress-core-installer true && \
    composer install --no-dev --optimize-autoloader

# Ensure proper permissions on the plugin files
#RUN chown -R www-data:www-data /var/www/html/wp-content/plugins && \
#   chmod -R 755 /var/www/html/wp-content/plugins

# Ensure proper permissions on the theme files
#RUN chown -R www-data:www-data /var/www/html/wp-content/themes && \
#    chmod -R 755 /var/www/html/wp-content/themes

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
COPY ./wp-content/uploads /var/www/html/wp-content/uploads

# Build SCSS do plugin
#WORKDIR /var/www/html/wp-content/plugins/bdm-digital-payment-gateway
#RUN npm install && npm run build

# Permissões e limpeza
WORKDIR /var/www/html
RUN chown -R www-data:www-data wp-content/plugins && \
    chmod -R 755 wp-content/plugins && \
    rm -rf wp-content/plugins/hello.php wp-content/plugins/hello-dolly wp-content/plugins/akismet

# Uploads
COPY uploads.ini /usr/local/etc/php/conf.d/uploads.ini

RUN mkdir -p /var/www/html/wp-content/uploads && \
    mkdir -p /var/www/html/wp-content && \
    mkdir -p /var/www/html/wp-admin && \
    chown -R www-data:www-data /var/www/html/ && \
    chmod -R 775 /var/www/html/wp-content/uploads && \
    chmod -R 775 /var/www/html/wp-content && \
    chmod -R 775 /var/www/html/wp-admin

# Arquivos de configuração
COPY .env /var/www/.env
COPY ./wp-config-template.php /var/www/html/wp-config-template.php
COPY ./setup-wp-config.sh /usr/local/bin/setup-wp-config.sh
RUN dos2unix /usr/local/bin/setup-wp-config.sh && chmod +x /usr/local/bin/setup-wp-config.sh

# Apenas criar o wp-config.php se necessário
RUN [ ! -f wp-config.php ] && cp wp-config-template.php wp-config.php || true

# SQL inicial
COPY ./dumps/wordpress_db.sql /docker-entrypoint-initdb.d/
RUN chmod 644 /docker-entrypoint-initdb.d/wordpress_db.sql

# Script init-db
COPY ./init-db.sh /usr/local/bin/init-db.sh
RUN dos2unix /usr/local/bin/init-db.sh && chmod +x /usr/local/bin/init-db.sh

# Configuração Apache
COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

EXPOSE 80

# Entrypoint final
ENTRYPOINT ["/bin/bash", "-c", "/usr/local/bin/setup-wp-config.sh && docker-entrypoint.sh apache2-foreground"]
