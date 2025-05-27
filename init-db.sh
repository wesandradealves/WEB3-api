#!/bin/bash

echo "Executando init-db.sh para inicializar o banco de dados e configurar URLs..."

# Carregar variáveis do arquivo .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Verificar se o banco de dados já existe
if ! mysql -h"$WORDPRESS_DB_HOST" -u"$WORDPRESS_DB_USER" -p"$WORDPRESS_DB_PASSWORD" -e "USE $WORDPRESS_DB_NAME"; then
  echo "Banco de dados '$WORDPRESS_DB_NAME' não existe. Criando..."
  mysql -h"$WORDPRESS_DB_HOST" -u"$WORDPRESS_DB_USER" -p"$WORDPRESS_DB_PASSWORD" -e "CREATE DATABASE $WORDPRESS_DB_NAME"
else
  echo "Banco de dados '$WORDPRESS_DB_NAME' já existe. Pulando criação."
fi

# Verifica se o banco está vazio
TABLE_COUNT=$(mysql -h "$WORDPRESS_DB_HOST" -u "$WORDPRESS_DB_USER" -p"$WORDPRESS_DB_PASSWORD" -e \
  "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$WORDPRESS_DB_NAME';" -s --skip-column-names)

if [ "$TABLE_COUNT" -eq 0 ]; then
  echo "O banco de dados está vazio. Verificando o arquivo SQL..."
  DUMP_FILE="/docker-entrypoint-initdb.d/wordpress_db.sql"

  if [ -f "$DUMP_FILE" ]; then
    echo "Importando o arquivo SQL..."
    if ! mysql -h "$WORDPRESS_DB_HOST" -u "$WORDPRESS_DB_USER" -p"$WORDPRESS_DB_PASSWORD" "$WORDPRESS_DB_NAME" < "$DUMP_FILE"; then
      echo "Erro ao importar o dump. Verifique o conteúdo do SQL."
      exit 1
    fi
  else
    echo "Arquivo $DUMP_FILE não encontrado. Abortando a importação."
  fi
else
  echo "Banco de dados já contém tabelas. Pulando importação."
fi

echo "# Determine o ambiente e a URL de destino"

# Verificar se o domínio atual é diferente de $TARGET_URL antes de substituir

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

  echo "Executando wp search-replace de http://$LOCALHOST para ${PROTOCOL}://$WORDPRESS_DOMAIN ..."
  wp search-replace "http://$LOCALHOST" "${PROTOCOL}://$WORDPRESS_DOMAIN" --all-tables --report-changed-only --allow-root
  
  wp search-replace "${PROTOCOL}://$WORDPRESS_DOMAIN/wp-content/uploads" "${PROXY}/wp-content/uploads" wp_posts --include-columns=guid,post_content --report-changed-only --allow-root
  wp search-replace "${PROTOCOL}://$WORDPRESS_DOMAIN/wp-content/uploads" "${PROXY}/wp-content/uploads" wp_postmeta --report-changed-only --allow-root

  OLD_URL="${PROTOCOL}://${WORDPRESS_DOMAIN}"
  NEW_URL="${PROXY}"
  
  echo "🎯 Substituindo GUIDs das mídias de $OLD_URL para $NEW_URL..."
  
  wp db query "
  UPDATE wp_posts 
  SET guid = REPLACE(guid, '${OLD_URL}', '${NEW_URL}') 
  WHERE post_type = 'attachment' AND guid LIKE '${OLD_URL}%';
  " --allow-root

  echo "✅ GUIDs de mídias atualizados com sucesso!"

  echo "🔍 Substituindo também nos metadados das mídias..."

  wp db query "
  UPDATE wp_postmeta 
  SET meta_value = REPLACE(meta_value, '${OLD_URL}', '${NEW_URL}') 
  WHERE post_id IN (
    SELECT ID FROM wp_posts WHERE post_type = 'attachment'
  ) AND meta_value LIKE '%${OLD_URL}%';
  " --allow-root

  echo "✅ Metadados de mídias atualizados também!"
fi

# Rodar composer install no plugin bdm-firebase-bff
echo "Rodando composer install em bdm-firebase-bff..."
cd /var/www/html/wp-content/plugins/bdm-firebase-bff

if [ -f composer.json ]; then
  composer install --no-interaction --prefer-dist --optimize-autoloader
else
  echo "composer.json não encontrado em bdm-firebase-bff. Pulando..."
fi

# Verifica se o WP-CLI está instalado e atualiza os permalinks
if command -v wp &> /dev/null; then
  cd /var/www/html/
  echo "Atualizando os permalinks..."
  wp option update permalink_structure '/arquivos/%post_id%' --allow-root
  wp option update permalink_structure '/%postname%/' --allow-root
  wp rewrite flush --allow-root
else
  echo "WP-CLI não encontrado. Não foi possível atualizar os permalinks."
fi

