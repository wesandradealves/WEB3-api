#!/bin/bash

# Certifique-se de que o wp-config.php existe
if [ ! -f /var/www/html/wp-config.php ]; then
    cp /var/www/html/wp-config-sample.php /var/www/html/wp-config.php
fi

# Replace placeholders in wp-config.php with environment variables
sed -i "s/database_name_here/${WORDPRESS_DB_NAME}/" /var/www/html/wp-config.php
sed -i "s/username_here/${WORDPRESS_DB_USER}/" /var/www/html/wp-config.php
sed -i "s/password_here/${WORDPRESS_DB_PASSWORD}/" /var/www/html/wp-config.php
sed -i "s/localhost/${WORDPRESS_DB_HOST}/" /var/www/html/wp-config.php

# Adicionar configurações ao wp-config.php
echo "define('JWT_AUTH_SECRET_KEY', '$(openssl rand -base64 64)');" >> /var/www/html/wp-config.php
echo "define('JWT_AUTH_CORS_ENABLE', true);" >> /var/www/html/wp-config.php
echo "define('FS_METHOD', 'direct');" >> /var/www/html/wp-config.php

# Iniciar o servidor Apache
exec apache2-foreground