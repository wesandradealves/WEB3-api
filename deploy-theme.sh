#!/bin/bash

# === CONFIGURAÇÕES ===
REPO_DIR="/var/www/bdm-web3-backend"
THEME_NAME="bdm-digital-website-api-theme"
WP_THEME_DIR="/var/www/html/wp-content/themes/$THEME_NAME"
APACHE_USER="www-data"

echo "🚀 Iniciando deploy do tema WordPress..."

# 1️⃣ Atualiza repositório
cd "$REPO_DIR" || { echo "❌ Erro: pasta do repositório não encontrada"; exit 1; }
echo "🔄 Atualizando repositório..."
git reset --hard
git pull origin main

# 2️⃣ Copia arquivos do tema para a pasta do WordPress
echo "📂 Copiando arquivos do tema para $WP_THEME_DIR..."
sudo rsync -av --delete "$REPO_DIR/$THEME_NAME/" "$WP_THEME_DIR/"

# 3️⃣ Ajusta permissões
echo "🔑 Ajustando permissões..."
sudo chown -R $APACHE_USER:$APACHE_USER "$WP_THEME_DIR"

# 4️⃣ Limpa cache do WordPress (se WP-CLI estiver disponível)
if command -v wp &> /dev/null; then
    echo "🧹 Limpando cache do WordPress..."
    cd /var/www/html
    sudo -u $APACHE_USER wp cache flush
fi

echo "✅ Deploy concluído com sucesso!"
