#!/bin/bash

# Configurações do banco RDS (produção)
RDS_HOST="dev-dourado-web3.cet6pltt6ywk.us-east-2.rds.amazonaws.com"
RDS_USER="admin"
RDS_PASSWORD="vMn5lef4j23x"
RDS_DATABASE="bdm_website_api"

# Configurações do ambiente local (ajuste conforme necessário)
LOCAL_CONTAINER_NAME="web3-api-mysql-1"  # Nome do container MySQL local
LOCAL_DB_USER="root"
LOCAL_DB_PASSWORD="root"  # Senha do .env
LOCAL_DB_NAME="wordpress_db"  # Nome do banco do .env

# URLs do WordPress (ajuste conforme necessário)
PRODUCTION_URL="https://api-dev-bdm.dourado.cash"  # URL de produção
LOCAL_URL="http://localhost:8000"         # URL local

# Nome do arquivo de dump
DUMP_FILE="wordpress_dump_$(date +%Y%m%d_%H%M%S).sql"

echo "======================================"
echo "Sincronização de banco WordPress"
echo "======================================"
echo "Origem: $RDS_HOST/$RDS_DATABASE"
echo "Destino: Container local $LOCAL_CONTAINER_NAME"
echo ""

# 1. Exporta o banco do RDS
echo "1. Exportando banco de dados do RDS..."
mysqldump -h "$RDS_HOST" \
          -u "$RDS_USER" \
          -p"$RDS_PASSWORD" \
          --single-transaction \
          --routines \
          --triggers \
          --add-drop-table \
          --create-options \
          --extended-insert \
          --lock-tables=false \
          --no-tablespaces \
          --column-statistics=0 \
          "$RDS_DATABASE" > "$DUMP_FILE"

if [ $? -ne 0 ] || [ ! -s "$DUMP_FILE" ]; then
    echo "✗ Erro ao exportar o banco de dados"
    exit 1
fi

echo "✓ Dump criado: $DUMP_FILE ($(du -h $DUMP_FILE | cut -f1))"

# 2. Cria backup do banco local (opcional)
echo ""
echo "2. Criando backup do banco local..."
docker exec "$LOCAL_CONTAINER_NAME" \
    mariadb-dump -u"$LOCAL_DB_USER" -p"$LOCAL_DB_PASSWORD" "$LOCAL_DB_NAME" \
    > "backup_local_$(date +%Y%m%d_%H%M%S).sql" 2>/dev/null

# 3. Importa o dump no banco local
echo ""
echo "3. Importando dump no banco local..."
docker exec -i "$LOCAL_CONTAINER_NAME" \
    mariadb -u"$LOCAL_DB_USER" -p"$LOCAL_DB_PASSWORD" "$LOCAL_DB_NAME" < "$DUMP_FILE"

if [ $? -ne 0 ]; then
    echo "✗ Erro ao importar o banco de dados"
    exit 1
fi

echo "✓ Banco importado com sucesso!"

# 4. Atualiza URLs do WordPress (search and replace)
echo ""
echo "4. Atualizando URLs do WordPress..."

# Cria script SQL para atualizar URLs
cat > update_urls.sql << EOF
-- Atualiza URLs nas opções do WordPress
UPDATE wp_options 
SET option_value = REPLACE(option_value, '$PRODUCTION_URL', '$LOCAL_URL') 
WHERE option_name = 'home' OR option_name = 'siteurl';

-- Atualiza URLs nos posts
UPDATE wp_posts 
SET guid = REPLACE(guid, '$PRODUCTION_URL', '$LOCAL_URL');

UPDATE wp_posts 
SET post_content = REPLACE(post_content, '$PRODUCTION_URL', '$LOCAL_URL');

UPDATE wp_posts 
SET post_excerpt = REPLACE(post_excerpt, '$PRODUCTION_URL', '$LOCAL_URL');

-- Atualiza URLs nos metadados dos posts
UPDATE wp_postmeta 
SET meta_value = REPLACE(meta_value, '$PRODUCTION_URL', '$LOCAL_URL')
WHERE meta_value LIKE '%$PRODUCTION_URL%';

-- Atualiza URLs nos comentários
UPDATE wp_comments 
SET comment_content = REPLACE(comment_content, '$PRODUCTION_URL', '$LOCAL_URL');

UPDATE wp_comments 
SET comment_author_url = REPLACE(comment_author_url, '$PRODUCTION_URL', '$LOCAL_URL');

-- Atualiza URLs nos termos
UPDATE wp_termmeta 
SET meta_value = REPLACE(meta_value, '$PRODUCTION_URL', '$LOCAL_URL')
WHERE meta_value LIKE '%$PRODUCTION_URL%';

-- Limpa cache de transients
DELETE FROM wp_options WHERE option_name LIKE '_transient_%';
DELETE FROM wp_options WHERE option_name LIKE '_site_transient_%';
EOF

# Executa as atualizações
docker exec -i "$LOCAL_CONTAINER_NAME" \
    mariadb -u"$LOCAL_DB_USER" -p"$LOCAL_DB_PASSWORD" "$LOCAL_DB_NAME" < update_urls.sql

if [ $? -eq 0 ]; then
    echo "✓ URLs atualizadas com sucesso!"
else
    echo "⚠ Aviso: Algumas URLs podem não ter sido atualizadas"
fi

# 5. Limpeza
rm -f update_urls.sql

echo ""
echo "======================================"
echo "Sincronização concluída!"
echo "======================================"
echo ""
echo "IMPORTANTE:"
echo "1. Verifique se o container MySQL está rodando: docker ps"
echo "2. Ajuste as variáveis no início do script se necessário"
echo "3. Você pode precisar limpar o cache do WordPress após a importação"
echo "4. Arquivo de dump mantido em: $DUMP_FILE"
echo ""
echo "Para remover o arquivo de dump: rm $DUMP_FILE"