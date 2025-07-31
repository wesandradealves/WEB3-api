#!/bin/bash

# Script de sincronização bidirecional de banco WordPress
# Uso: ./sync-wordpress-database.sh [docker-to-rds|rds-to-docker]

# Obtém o diretório do script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/.."

# Carrega variáveis do .env
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Arquivo .env não encontrado!"
    exit 1
fi

# Configurações do banco RDS (produção)
# Se as variáveis não forem para RDS (ex: apontando para mysql local), usa os valores do RDS
if [ "${WORDPRESS_DB_HOST}" = "mysql" ] || [ -z "${RDS_HOST}" ]; then
    RDS_HOST="dev-dourado-web3.cet6pltt6ywk.us-east-2.rds.amazonaws.com"
    RDS_USER="admin"
    RDS_PASSWORD="vMn5lef4j23x"
    RDS_DATABASE="bdm_website_api"
else
    RDS_HOST="${WORDPRESS_DB_HOST}"
    RDS_USER="${WORDPRESS_DB_USER}"
    RDS_PASSWORD="${WORDPRESS_DB_PASSWORD}"
    RDS_DATABASE="${WORDPRESS_DB_NAME}"
fi

# Configurações do ambiente local (do .env)
LOCAL_CONTAINER_NAME="${COMPOSE_PROJECT_NAME:-web3-api}-mysql-1"
LOCAL_DB_USER="${DB_USER:-root}"
LOCAL_DB_PASSWORD="${DB_PASSWORD:-root}"
LOCAL_DB_NAME="${DB_NAME:-wordpress_db}"

# URLs do WordPress
PRODUCTION_URL="https://api-dev-bdm.dourado.cash"
LOCAL_URL="http://localhost:${PORT:-8000}"

# Diretório de dumps
DUMPS_DIR="./dumps"
mkdir -p "$DUMPS_DIR"

# Arquivo de dump principal (sempre o mesmo)
MAIN_DUMP_FILE="$DUMPS_DIR/wordpress_db.sql"

# Função para mostrar uso
show_usage() {
    echo "======================================"
    echo "Sincronização de Banco WordPress"
    echo "======================================"
    echo ""
    echo "Uso: $0 [direção]"
    echo ""
    echo "Direções disponíveis:"
    echo "  docker-to-rds    Sincroniza do Docker local para RDS"
    echo "  rds-to-docker    Sincroniza do RDS para Docker local"
    echo ""
    echo "Exemplo:"
    echo "  $0 docker-to-rds"
    echo "  $0 rds-to-docker"
    echo ""
    exit 1
}

# Função para verificar container Docker
check_docker_container() {
    if ! docker ps --format '{{.Names}}' | grep -q "^${LOCAL_CONTAINER_NAME}$"; then
        echo "❌ Container MySQL não encontrado: $LOCAL_CONTAINER_NAME"
        echo "Verifique se o Docker Compose está rodando: docker-compose up -d"
        exit 1
    fi
}

# Função para fazer backup
create_backup() {
    local source=$1
    local backup_file="$DUMPS_DIR/backup_${source}_$(date +%Y%m%d_%H%M%S).sql"
    
    echo "📁 Criando backup do $source..."
    
    if [ "$source" = "docker" ]; then
        docker exec "$LOCAL_CONTAINER_NAME" \
            mariadb-dump -u"$LOCAL_DB_USER" -p"$LOCAL_DB_PASSWORD" "$LOCAL_DB_NAME" \
            > "$backup_file" 2>/dev/null
    else
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
                  "$RDS_DATABASE" > "$backup_file"
    fi
    
    if [ $? -eq 0 ] && [ -s "$backup_file" ]; then
        echo "✅ Backup criado: $backup_file ($(du -h $backup_file | cut -f1))"
    else
        echo "❌ Erro ao criar backup"
        rm -f "$backup_file"
        return 1
    fi
}

# Função para sincronizar Docker → RDS
sync_docker_to_rds() {
    echo "======================================"
    echo "Sincronização: Docker → RDS"
    echo "======================================"
    echo "Origem: Container $LOCAL_CONTAINER_NAME/$LOCAL_DB_NAME"
    echo "Destino: $RDS_HOST/$RDS_DATABASE"
    echo ""
    
    check_docker_container
    
    # 1. Cria backup do dump atual se existir
    if [ -f "$MAIN_DUMP_FILE" ]; then
        backup_file="$DUMPS_DIR/wordpress_db_backup_$(date +%Y%m%d_%H%M%S).sql"
        cp "$MAIN_DUMP_FILE" "$backup_file"
        echo "📋 Backup do dump anterior criado: $backup_file"
    fi
    
    # 2. Exporta o banco do Docker
    echo "1️⃣ Exportando banco de dados do Docker..."
    
    docker exec "$LOCAL_CONTAINER_NAME" \
        mariadb-dump -u"$LOCAL_DB_USER" -p"$LOCAL_DB_PASSWORD" "$LOCAL_DB_NAME" \
        > "$MAIN_DUMP_FILE" 2>/dev/null
    
    if [ $? -ne 0 ] || [ ! -s "$MAIN_DUMP_FILE" ]; then
        echo "❌ Erro ao exportar o banco de dados"
        exit 1
    fi
    
    echo "✅ Dump criado: $MAIN_DUMP_FILE ($(du -h $MAIN_DUMP_FILE | cut -f1))"
    
    # 2. Cria backup do RDS (opcional)
    echo ""
    read -p "Deseja criar backup do RDS antes de importar? (s/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        create_backup "rds"
    fi
    
    # 3. Importa o dump no RDS
    echo ""
    echo "2️⃣ Importando dump no RDS..."
    mysql -h "$RDS_HOST" \
          -u "$RDS_USER" \
          -p"$RDS_PASSWORD" \
          "$RDS_DATABASE" < "$MAIN_DUMP_FILE"
    
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao importar o banco de dados"
        exit 1
    fi
    
    echo "✅ Banco importado com sucesso!"
    
    # 4. Atualiza URLs
    echo ""
    echo "3️⃣ Atualizando URLs no RDS..."
    
    mysql -h "$RDS_HOST" \
          -u "$RDS_USER" \
          -p"$RDS_PASSWORD" \
          "$RDS_DATABASE" << EOF
-- Atualiza URLs nas opções do WordPress
UPDATE wp_options 
SET option_value = REPLACE(option_value, '$LOCAL_URL', '$PRODUCTION_URL') 
WHERE option_name = 'home' OR option_name = 'siteurl';

-- Atualiza URLs nos posts
UPDATE wp_posts 
SET guid = REPLACE(guid, '$LOCAL_URL', '$PRODUCTION_URL');

UPDATE wp_posts 
SET post_content = REPLACE(post_content, '$LOCAL_URL', '$PRODUCTION_URL');

UPDATE wp_posts 
SET post_excerpt = REPLACE(post_excerpt, '$LOCAL_URL', '$PRODUCTION_URL');

-- Atualiza URLs nos metadados dos posts
UPDATE wp_postmeta 
SET meta_value = REPLACE(meta_value, '$LOCAL_URL', '$PRODUCTION_URL')
WHERE meta_value LIKE '%$LOCAL_URL%';

-- Atualiza URLs nos comentários
UPDATE wp_comments 
SET comment_content = REPLACE(comment_content, '$LOCAL_URL', '$PRODUCTION_URL');

UPDATE wp_comments 
SET comment_author_url = REPLACE(comment_author_url, '$LOCAL_URL', '$PRODUCTION_URL');

-- Atualiza URLs nos termos
UPDATE wp_termmeta 
SET meta_value = REPLACE(meta_value, '$LOCAL_URL', '$PRODUCTION_URL')
WHERE meta_value LIKE '%$LOCAL_URL%';

-- Limpa cache de transients
DELETE FROM wp_options WHERE option_name LIKE '_transient_%';
DELETE FROM wp_options WHERE option_name LIKE '_site_transient_%';
EOF
    
    if [ $? -eq 0 ]; then
        echo "✅ URLs atualizadas com sucesso!"
    else
        echo "⚠️  Aviso: Algumas URLs podem não ter sido atualizadas"
    fi
    
    echo ""
    echo "✅ Sincronização Docker → RDS concluída!"
    echo "📋 Dump atualizado em: $MAIN_DUMP_FILE"
}

# Função para sincronizar RDS → Docker
sync_rds_to_docker() {
    echo "======================================"
    echo "Sincronização: RDS → Docker"
    echo "======================================"
    echo "Origem: $RDS_HOST/$RDS_DATABASE"
    echo "Destino: Container $LOCAL_CONTAINER_NAME/$LOCAL_DB_NAME"
    echo ""
    
    check_docker_container
    
    # 1. Cria backup do dump atual se existir
    if [ -f "$MAIN_DUMP_FILE" ]; then
        backup_file="$DUMPS_DIR/wordpress_db_backup_$(date +%Y%m%d_%H%M%S).sql"
        cp "$MAIN_DUMP_FILE" "$backup_file"
        echo "📋 Backup do dump anterior criado: $backup_file"
    fi
    
    # 2. Exporta o banco do RDS
    echo "1️⃣ Exportando banco de dados do RDS..."
    
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
              "$RDS_DATABASE" > "$MAIN_DUMP_FILE"
    
    if [ $? -ne 0 ] || [ ! -s "$MAIN_DUMP_FILE" ]; then
        echo "❌ Erro ao exportar o banco de dados"
        exit 1
    fi
    
    echo "✅ Dump criado: $MAIN_DUMP_FILE ($(du -h $MAIN_DUMP_FILE | cut -f1))"
    
    # 2. Cria backup do Docker (opcional)
    echo ""
    read -p "Deseja criar backup do Docker antes de importar? (s/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        create_backup "docker"
    fi
    
    # 3. Importa o dump no Docker
    echo ""
    echo "2️⃣ Importando dump no Docker..."
    docker exec -i "$LOCAL_CONTAINER_NAME" \
        mariadb -u"$LOCAL_DB_USER" -p"$LOCAL_DB_PASSWORD" "$LOCAL_DB_NAME" < "$MAIN_DUMP_FILE"
    
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao importar o banco de dados"
        exit 1
    fi
    
    echo "✅ Banco importado com sucesso!"
    
    # 4. Atualiza URLs
    echo ""
    echo "3️⃣ Atualizando URLs no Docker..."
    
    # Cria script SQL temporário
    cat > "$DUMPS_DIR/update_urls_temp.sql" << EOF
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
        mariadb -u"$LOCAL_DB_USER" -p"$LOCAL_DB_PASSWORD" "$LOCAL_DB_NAME" < "$DUMPS_DIR/update_urls_temp.sql"
    
    if [ $? -eq 0 ]; then
        echo "✅ URLs atualizadas com sucesso!"
    else
        echo "⚠️  Aviso: Algumas URLs podem não ter sido atualizadas"
    fi
    
    # Limpa arquivo temporário
    rm -f "$DUMPS_DIR/update_urls_temp.sql"
    
    echo ""
    echo "✅ Sincronização RDS → Docker concluída!"
    echo "📋 Dump atualizado em: $MAIN_DUMP_FILE"
}

# Função para mostrar resumo
show_summary() {
    echo ""
    echo "======================================"
    echo "📊 Resumo da Configuração"
    echo "======================================"
    echo ""
    echo "🐋 Docker Local:"
    echo "   Container: $LOCAL_CONTAINER_NAME"
    echo "   Database: $LOCAL_DB_NAME"
    echo "   URL: $LOCAL_URL"
    echo ""
    echo "☁️  RDS AWS:"
    echo "   Host: $RDS_HOST"
    echo "   Database: $RDS_DATABASE"
    echo "   URL: $PRODUCTION_URL"
    echo ""
    echo "📁 Diretório de dumps: $DUMPS_DIR"
    echo "📄 Arquivo de dump principal: wordpress_db.sql"
    echo ""
}

# Verifica parâmetro
if [ $# -eq 0 ]; then
    show_usage
fi

# Verifica dependências
for cmd in mysql mysqldump docker; do
    if ! command -v $cmd &> /dev/null; then
        echo "❌ Comando '$cmd' não encontrado. Por favor, instale antes de continuar."
        exit 1
    fi
done

# Executa ação baseada no parâmetro
case "$1" in
    "docker-to-rds")
        show_summary
        echo "⚠️  ATENÇÃO: Isso sobrescreverá o banco RDS com dados do Docker local!"
        read -p "Tem certeza que deseja continuar? (s/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            sync_docker_to_rds
        else
            echo "❌ Operação cancelada"
            exit 0
        fi
        ;;
    "rds-to-docker")
        show_summary
        echo "⚠️  ATENÇÃO: Isso sobrescreverá o banco Docker local com dados do RDS!"
        read -p "Tem certeza que deseja continuar? (s/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Ss]$ ]]; then
            sync_rds_to_docker
        else
            echo "❌ Operação cancelada"
            exit 0
        fi
        ;;
    *)
        echo "❌ Direção inválida: $1"
        echo ""
        show_usage
        ;;
esac

echo ""
echo "💡 Dicas:"
echo "   - Limpe o cache do WordPress após a sincronização"
echo "   - Verifique os permalinks no admin do WordPress"
echo "   - Teste os endpoints da API após a sincronização"
echo ""