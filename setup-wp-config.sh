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

# 🕒 Aguardar MySQL estar pronto
echo "⏳ Aguardando MySQL estar pronto..."
until mysqladmin ping -h"$WORDPRESS_DB_HOST" --silent; do
  sleep 5
done
echo "✅ MySQL está pronto!"

# 🧪 Executar script de inicialização do banco de dados
if [ -f /usr/local/bin/init-db.sh ]; then
  echo "🗄️ Executando init-db.sh..."
  /bin/bash /usr/local/bin/init-db.sh
else
  echo "⚠️ init-db.sh não encontrado."
fi

# Iniciar o servidor Apache
exec apache2-foreground