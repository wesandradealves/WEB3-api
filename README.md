# 🚀 WordPress BDM Digital REST API com Docker

Este repositório contém uma **configuração WordPress** com tema customizado para API e plugins necessários, tudo gerenciado usando **Docker Compose**.

- [Frontend](https://github.com/Dourado-Cash/bdm-web3-frontend)

---

## Funcionalidades
- **WordPress em Docker** para fácil implantação
- **MySQL & phpMyAdmin** incluídos
- **Plugins WordPress pré-instalados**
- **Gerenciamento WordPress baseado em Composer**
- **Suporte ao WP-CLI**
- **Integração para compilação SASS**
- **Suporte ACF (Advanced Custom Fields) para REST API**

---

## Estrutura do Projeto

```sh
/
│── bdm-digital-website-api-theme/     # Tema WordPress Customizado
│── classic-editor/                     # Plugin Classic Editor
│── sass-to-css-compiler/               # Plugin Compilador SASS
│── acf-to-rest-api/                    # Plugin ACF para REST API
│── advanced-custom-fields-pro/         # Plugin Advanced Custom Fields
│── wp-rest-api-controller/             # Plugin WP REST API Controller
│── docker-compose.yml                   # Configuração Docker Compose
│── Dockerfile                           # Imagem WordPress Customizada
│── composer.json                        # WordPress com Composer
│── .env                                 # Variáveis de Ambiente
```

---

## Instalação e Configuração

### **Pré-requisitos**
Antes de começar, certifique-se de ter instalado:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Composer](https://getcomposer.org/)

### **Clonar o repositório**

```sh
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

### **Criar arquivo .env**
Crie um arquivo .env no diretório raiz e adicione as variáveis de ambiente necessárias:

```bash
Valores de ENVIRONMENT são: local ou hml
```

```sh
# Banco de Dados MySQL
MYSQL_DATABASE=bdm_digital_plugin
MYSQL_ROOT_PASSWORD=root
ENVIRONMENT=local

# Banco de Dados WordPress
WORDPRESS_DB_HOST=mysql
WORDPRESS_DB_USER=root
WORDPRESS_DB_PASSWORD=root
WORDPRESS_DB_NAME=bdm_digital_plugin
WP_DEBUG=FALSE
WP_DEBUG_DISPLAY=FALSE

# Site WordPress
WORDPRESS_DOMAIN=54.207.253.67:8000
WORDPRESS_USER=admin
WORDPRESS_PWD=admin
JWT_AUTH_SECRET_KEY=6oVSojxH7BlqRyq2l4iQbOiDikyzebKL4QtZiwBRvF5QWY91qL6kqNiatEFCE6Xb6RYsiwlr6cQpoabDQffQjw==


```

### **Iniciar os Containers**
Execute o seguinte comando para construir e iniciar o WordPress:

```sh
docker-compose up -d --build
```

### **Acessar o WordPress**
Quando os containers estiverem rodando, abra:

- WordPress: http://localhost:8000
- phpMyAdmin: http://localhost:8081

### **Plugins Necessários**
Estes plugins são pré-instalados no container:

- Classic Editor
- SASS to CSS Compiler
- ACF to REST API
- Advanced Custom Fields PRO
- WP REST API Controller

### **Comandos de Desenvolvimento**

**Reconstruir os Containers**
```sh
docker-compose up -d --build
```

**Parar os Containers**
```sh
docker-compose down
```

**Visualizar Logs**
```sh
docker-compose logs -f
```

**Executar Comandos WP-CLI**
```sh
docker-compose exec wordpress wp plugin list
```

**Resetar Tudo (Deletar Banco de Dados)**
```sh
docker-compose down -v
```

### **Solução de Problemas**

**Problemas de Conexão com Banco de Dados**
```sh
docker-compose ps
docker-compose restart mysql
```

**Problemas de Permissão**
```sh
docker-compose exec wordpress chown -R www-data:www-data /var/www/html
```

### **Documentação Swagger da API**
Você pode visualizar a documentação Swagger para a REST API do WordPress na seguinte URL:

- Documentação Swagger: http://localhost:8000/swagger

Isso carregará a interface Swagger UI com a especificação OpenAPI para a REST API do WordPress.

**Criando a Página Swagger Programaticamente**

Ao ativar o tema, uma página será criada na URL http://localhost:8000/swagger usando o template swagger.php. A Swagger UI será incorporada nesta página, mostrando a especificação OpenAPI para sua REST API.

**Como Funciona:**

- A Swagger UI está incorporada em um template de página (swagger.php) localizado na pasta templates/swagger/ do tema.

- A página é criada quando o tema é ativado e é removida quando o tema é desinstalado.

Isso facilita o acesso e visualização da documentação da sua API diretamente do seu site WordPress.

---

## 🎯 Documentação dos Endpoints da REST API

### **Endpoints Customizados (namespace: `/wp-json/custom/v1/`)**

#### **Endpoint de Configurações**
- **URL**: `/wp-json/custom/v1/settings`
- **Método**: GET
- **Descrição**: Retorna configurações do site incluindo redes sociais, logo, favicon e informações do blog
- **Exemplo de Resposta**:
```json
{
  "social_networks": [
    {"title": "Facebook", "url": "https://facebook.com/..."},
    {"title": "Instagram", "url": "https://instagram.com/..."}
  ],
  "custom_logo": "https://site.com/logo.png",
  "favicon": "https://site.com/favicon.ico",
  "blog_info": {
    "name": "Nome do Site",
    "description": "Descrição do Site",
    "url": "https://site.com",
    "admin_email": "admin@site.com"
  }
}
```

#### **Endpoint de Menus**
- **URL**: `/wp-json/custom/v1/menus?slug={menu-slug}`
- **Método**: GET
- **Descrição**: Retorna estrutura hierárquica do menu com campos ACF
- **Parâmetros**: 
  - `slug` (obrigatório): Slug do menu (ex: 'main', 'footer', 'lateral')
- **Multi-idioma**: Automaticamente adiciona sufixo de idioma (ex: 'main-en' para inglês)

#### **Endpoint de CSS Extra**
- **URL**: `/wp-json/custom/v1/extra-css`
- **Método**: GET
- **Descrição**: Retorna CSS do Personalizador do WordPress
- **Exemplo de Resposta**:
```json
{
  "theme": "bdm-digital-website-api-theme",
  "custom_css": "/* CSS customizado do Personalizador do WordPress */"
}
```

#### **Health Check da API**
- **URL**: `/wp-json/custom/v1/api-health`
- **Método**: GET
- **Descrição**: Endpoint simples de health check
- **Resposta**: `{"status": "ok"}`

#### **Endpoint de Idiomas**
- **URL**: `/wp-json/custom/v1/languages`
- **Método**: GET
- **Descrição**: Retorna idiomas disponíveis (integração Polylang)
- **Exemplo de Resposta**: `["pt", "en"]`

#### **Endpoint Post By**
- **URL**: `/wp-json/custom/v1/post-by`
- **Método**: GET
- **Descrição**: Busca flexível de posts/páginas com suporte multi-idioma
- **Parâmetros**:
  - `slug` (opcional): Slug do post/página
  - `id` (opcional): ID do post/página
  - `type` (opcional, padrão: 'page'): Tipo de post
- **Headers**:
  - `X-Language` (opcional): Código do idioma (ex: 'en', 'pt')

### **Endpoint Firebase BFF (namespace: `/wp-json/bdm/v1/`)**
- **URL**: `/wp-json/bdm/v1/analytics`
- **Método**: GET
- **Descrição**: Integração com Google Analytics 4
- **Plugin**: bdm-firebase-bff

---

## 🏗️ Arquitetura do Tema

### **Recursos do Tema Customizado**

O tema `bdm-digital-website-api-theme` inclui:

1. **Suporte a Blocos ACF**
   - Blocos hero
   - Blocos de seção
   - Blocos de scroll de mídia
   - Blocos de linha do tempo
   - Blocos de cards com movimento
   - Blocos de métricas Firebase GA
   - E mais...

2. **Suporte Multi-idioma**
   - Integração Polylang
   - Suporte ao header X-Language na REST API
   - Tradução automática de menus

3. **Configuração CORS**
   ```php
   header('Access-Control-Allow-Origin: *');
   header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
   header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Language');
   ```

4. **Autenticação JWT**
   - Plugin: jwt-authentication-for-wp-rest-api
   - Endpoint: `/wp-json/jwt-auth/v1/token`
   - Chave secreta configurada no `.env`

---

## 🔧 Fluxo de Trabalho de Desenvolvimento

### **Trabalhando com Blocos ACF**

1. Registrar blocos no `functions.php`:
```php
acf_register_block_type(array(
    'name' => 'nome-do-bloco',
    'title' => __('Título do Bloco'),
    'description' => __('Descrição do Bloco'),
    'render_template' => get_template_directory() . '/templates/blocks.php',
    'category' => 'rest-api',
    'keywords' => ['palavra1', 'palavra2'],
));
```

2. Blocos são automaticamente expostos nas respostas da REST API em `acf_blocks`

### **Adicionando Novos Endpoints Customizados**

Adicione ao `functions.php` do tema:
```php
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/seu-endpoint', array(
        'methods' => 'GET',
        'callback' => 'sua_funcao_callback',
        'permission_callback' => '__return_true', // Endpoint público
    ));
});
```

### **Dumps de Banco de Dados**

Dumps de exportação/importação estão disponíveis em:
- Local: `dumps/local/`
- Homologação: `dumps/hml/`

---

## 🚀 Deploy em Produção

### **Configuração de Ambiente**

Para produção, atualize o `.env`:
```bash
ENVIRONMENT=production
WP_DEBUG=FALSE
WP_DEBUG_DISPLAY=FALSE
WORDPRESS_DOMAIN=seu-dominio-producao.com
```

### **Considerações de Segurança**

1. **Altere as credenciais padrão** em produção
2. **Gere nova chave secreta JWT**: Use uma chave forte e única
3. **Configure CORS adequadamente** para seu domínio frontend
4. **Habilite SSL/HTTPS** para todos os endpoints
5. **Restrinja acesso ao phpMyAdmin** em produção

### **Otimização de Performance**

1. **Habilite plugins de cache** (ex: W3 Total Cache)
2. **Use CDN** para arquivos de mídia
3. **Otimize imagens** com plugins como Smush
4. **Habilite compressão Gzip** no Apache/Nginx
5. **Configure headers de cache adequados** para respostas da API

---

## 📚 Recursos Adicionais

- **Repositório Frontend**: [GitHub - bdm-web3-frontend](https://github.com/Dourado-Cash/bdm-web3-frontend)
- **Manual WordPress REST API**: [developer.wordpress.org/rest-api](https://developer.wordpress.org/rest-api/)
- **Documentação ACF**: [advancedcustomfields.com/resources](https://www.advancedcustomfields.com/resources/)
- **Autenticação JWT**: [wordpress.org/plugins/jwt-authentication-for-wp-rest-api](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)

---

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie sua branch de funcionalidade (`git checkout -b feature/FuncionalidadeIncrivel`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona FuncionalidadeIncrivel'`)
4. Faça push para a branch (`git push origin feature/FuncionalidadeIncrivel`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto é software proprietário. Todos os direitos reservados.