#!/bin/bash

# Variáveis de ambiente
DB_HOST=${MYSQL_HOST:-localhost}
DB_USER=${MYSQL_USER:-root}
DB_PASSWORD=${MYSQL_PASSWORD:-root}
DB_NAME=${MYSQL_DATABASE:-wordpress_db}

# Comando para verificar se o banco está vazio
TABLE_COUNT=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';" -s --skip-column-names)

if [ "$TABLE_COUNT" -eq 0 ]; then
  echo "O banco de dados está vazio. Importando o arquivo SQL..."
  mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < /docker-entrypoint-initdb.d/wordpress.sql
else
  echo "O banco de dados já contém tabelas. Nenhuma importação necessária."
fi