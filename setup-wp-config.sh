#!/bin/bash

set -x

# Carregar variáveis do arquivo .env
if [ -f .env ]; then
  set -a
  source .env
  set +a
fi

# Certifique-se de que o wp-config.php existe
if [ ! -f /var/www/html/wp-config.php ]; then
    cp /var/www/html/wp-config-sample.php /var/www/html/wp-config.php
fi

if [ "$ENVIRONMENT" == "local" ]; then
  if [ "$SSL" == "true" ]; then
    PROTOCOL="https"
  else
    PROTOCOL="http"
  fi
  TARGET_URL="${PROTOCOL}://${LOCALHOST}/"
  echo "Ambiente local detectado. Usando URL: $TARGET_URL"
else
  if [ "$SSL" == "true" ]; then
    PROTOCOL="https"
  else
    PROTOCOL="http"
  fi
  TARGET_URL="${PROTOCOL}://${WORDPRESS_DOMAIN}/"
  echo "Ambiente de produção detectado. Usando URL: $TARGET_URL"
fi

insert_define() {
  local key="$1"
  local value="$2"
  # Procura apenas por defines não comentados
  if ! grep -q "^[^#]*define('$key'," "$WPCONFIG"; then
    echo "➕ Adicionando define('$key', $value) ao wp-config.php"
    sed -i "/^\/\* That's all, stop editing! Happy publishing. \*\//i define('$key', $value);" "$WPCONFIG"
  else
    echo "✔️ $key já existe em wp-config.php, pulando..."
  fi
}

update_define() {
  local key="$1"
  local value="$2"
  if grep -q "^[^#]*define('$key'," "$WPCONFIG"; then
    echo "🔄 Atualizando define('$key') no wp-config.php"
    sed -i "s|^.*define('$key',.*);|define('$key', $value);|" "$WPCONFIG"
  else
    echo "➕ Adicionando define('$key', $value) ao wp-config.php"
    sed -i "/^\/\* That's all, stop editing! Happy publishing. \*\//i define('$key', $value);" "$WPCONFIG"
  fi
}

echo "✅ WORDPRESS_DB_HOST=$WORDPRESS_DB_HOST"
echo "✅ WORDPRESS_DB_USER=$WORDPRESS_DB_USER"
echo "✅ WORDPRESS_DB_PASSWORD=$WORDPRESS_DB_PASSWORD"
echo "✅ WORDPRESS_DB_NAME=$WORDPRESS_DB_NAME"
echo "✅ JWT_AUTH_SECRET_KEY=$JWT_AUTH_SECRET_KEY"
echo "✅ TARGET_URL=$TARGET_URL"
echo "✅ WP_DEBUG=$WP_DEBUG"
echo "✅ WP_DEBUG_DISPLAY=$WP_DEBUG_DISPLAY"
echo "✅ WP_MEMORY_LIMIT=$WP_MEMORY_LIMIT"
echo "✅ WP_MAX_MEMORY_LIMIT=$WP_MAX_MEMORY_LIMIT"
echo "✅ WORDPRESS_MAIL=$WORDPRESS_MAIL"
echo "✅ WORDPRESS_USER=$WORDPRESS_USER"
echo "✅ WORDPRESS_PWD=$WORDPRESS_PWD"
echo "✅ FS_METHOD=$FS_METHOD"
echo "✅ JWT_AUTH_CORS_ENABLE=$JWT_AUTH_CORS_ENABLE"

WPCONFIG="/var/www/html/wp-config.php"
WPCONFIG_TEMPLATE="/var/www/html/wp-config-template.php"

# 📄 Criar wp-config.php se não existir
if [ ! -f "$WPCONFIG" ]; then
    echo "🛠️ Criando wp-config.php a partir do template..."
    cp "$WPCONFIG_TEMPLATE" "$WPCONFIG"
fi

# 🧽 Limpar ^M (CRLF) de Windows
echo "🧹 Limpando ^M do wp-config.php..."
sed -i 's/\r$//' "$WPCONFIG"

if [ "$ENVIRONMENT" != "local" ] && [ -n "$PROXY" ]; then
  FINAL_URL="$PROXY"
else
  FINAL_URL="$TARGET_URL"
fi

update_define "WP_HOME" "'$FINAL_URL'"
update_define "WP_SITEURL" "'$FINAL_URL'"

echo "🌐 WP_HOME/WP_SITEURL definido como: $FINAL_URL"

echo "DEBUG: ENVIRONMENT=$ENVIRONMENT"
echo "DEBUG: LOCALHOST=$LOCALHOST"
echo "DEBUG: WORDPRESS_DOMAIN=$WORDPRESS_DOMAIN"
echo "DEBUG: TARGET_URL=$TARGET_URL"

# 🔁 Substituir getenv() pelos valores reais
sed -i "s/getenv('WORDPRESS_DB_NAME')/'${WORDPRESS_DB_NAME}'/" "$WPCONFIG"
sed -i "s/getenv('WORDPRESS_DB_USER')/'${WORDPRESS_DB_USER}'/" "$WPCONFIG"
sed -i "s/getenv('WORDPRESS_DB_PASSWORD')/'${WORDPRESS_DB_PASSWORD}'/" "$WPCONFIG"
sed -i "s/getenv('WORDPRESS_DB_HOST')/'${WORDPRESS_DB_HOST}'/" "$WPCONFIG"
sed -i "s/getenv('WP_DEBUG')/${WP_DEBUG}/" "$WPCONFIG"
sed -i "s/getenv('WP_DEBUG_DISPLAY')/${WP_DEBUG_DISPLAY}/" "$WPCONFIG"
sed -i "s/getenv('JWT_AUTH_SECRET_KEY')/'${JWT_AUTH_SECRET_KEY}'/" "$WPCONFIG"
sed -i "s/getenv('WP_MEMORY_LIMIT')/'${WP_MEMORY_LIMIT}'/" "$WPCONFIG"
sed -i "s/getenv('WP_MAX_MEMORY_LIMIT')/'${WP_MAX_MEMORY_LIMIT}'/" "$WPCONFIG"
sed -i "s/getenv('WP_DEBUG_LOG')/${WP_DEBUG_LOG}/" "$WPCONFIG"
sed -i "s/getenv('WP_ALLOW_REPAIR')/${WP_ALLOW_REPAIR}/" "$WPCONFIG"
sed -i "s/getenv('FS_METHOD')/'${FS_METHOD}'/" "$WPCONFIG"
sed -i "s/getenv('JWT_AUTH_CORS_ENABLE')/'${JWT_AUTH_CORS_ENABLE}'/" "$WPCONFIG"

if [ ! -f /var/www/html/wp-config.php ]; then
    cp /var/www/html/wp-config-sample.php /var/www/html/wp-config.php

    # Substituir placeholders apenas se criou do sample
    sed -i "s/database_name_here/${WORDPRESS_DB_NAME}/" /var/www/html/wp-config.php
    sed -i "s/username_here/${WORDPRESS_DB_USER}/" /var/www/html/wp-config.php
    sed -i "s/password_here/${WORDPRESS_DB_PASSWORD}/" /var/www/html/wp-config.php
    sed -i "s/localhost/${WORDPRESS_DB_HOST}/" /var/www/html/wp-config.php
fi

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

# 🧰 Verificar instalação do WordPress
if ! wp core is-installed --allow-root; then
    echo "⚠️ WordPress ainda não está instalado. Instalando agora..."
    wp core install \
        --url="$TARGET_URL" \
        --title="Meu Site WordPress" \
        --admin_user="$WORDPRESS_USER" \
        --admin_password="$WORDPRESS_PWD" \
        --admin_email="$WORDPRESS_MAIL" \
        --allow-root
    echo "✔️ WordPress instalado com sucesso!"
else
    echo "✔️ WordPress já está instalado, pulando instalação."
fi

# 🔐 Permissões
chown www-data:www-data "$WPCONFIG"
chmod 664 "$WPCONFIG"

# 🔍 Mostrar últimas linhas do wp-config.php (debug)
echo "📄 Conteúdo final do wp-config.php:"
tail -n 20 "$WPCONFIG"

# 🚀 Inicializar Apache
echo "====================================="
echo "✅ Ambiente WordPress preparado!"
echo "====================================="
exec docker-entrypoint.sh apache2-foreground

# Iniciar o servidor Apache
exec apache2-foreground
