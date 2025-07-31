#!/bin/bash

# Configurações do banco RDS
RDS_HOST="dev-dourado-web3.cet6pltt6ywk.us-east-2.rds.amazonaws.com"
RDS_USER="admin"
RDS_PASSWORD="vMn5lef4j23x"
RDS_DATABASE="bdm_website_api"

# Diretório de dumps
DUMP_DIR="dumps"

# Nome do arquivo de dump com timestamp
DUMP_FILE="$DUMP_DIR/rds_dump_$(date +%Y%m%d_%H%M%S).sql"

echo "========================================"
echo "Exportando banco de dados RDS"
echo "========================================"
echo "Host: $RDS_HOST"
echo "Database: $RDS_DATABASE"
echo "Destino: $DUMP_FILE"
echo ""

# Executa o dump do banco de dados
echo "Exportando banco de dados..."
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

# Verifica se o dump foi criado com sucesso
if [ $? -eq 0 ] && [ -s "$DUMP_FILE" ]; then
    echo ""
    echo "✓ Dump exportado com sucesso!"
    echo "✓ Arquivo: $DUMP_FILE"
    echo "✓ Tamanho: $(du -h $DUMP_FILE | cut -f1)"
else
    echo ""
    echo "✗ Erro ao exportar o banco de dados"
    rm -f "$DUMP_FILE"
    exit 1
fi