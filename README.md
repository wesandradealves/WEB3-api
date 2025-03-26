# 🚀 WordPress BDM Digital REST API with Docker

This repository contains a **WordPress setup** with a custom API theme and required plugins, all managed using **Docker Compose**.

---

## Features
- **Dockerized WordPress** for easy deployment
- **MySQL & phpMyAdmin** included
- **Pre-installed WordPress plugins**
- **Composer-based WordPress management**
- **WP-CLI support**
- **SASS compilation integration**
- **ACF (Advanced Custom Fields) to REST API support**

---

## Project Structure

```sh
/
│── bdm-digital-website-api-theme/     # Custom WordPress Theme
│── classic-editor/                     # Classic Editor Plugin
│── sass-to-css-compiler/               # SASS Compiler Plugin
│── acf-to-rest-api/                    # ACF to REST API Plugin
│── advanced-custom-fields-pro/         # Advanced Custom Fields Plugin
│── wp-rest-api-controller/             # WP REST API Controller Plugin
│── docker-compose.yml                   # Docker Compose Configuration
│── Dockerfile                           # Custom WordPress Image
│── composer.json                        # WordPress with Composer
│── .env                                 # Environment Variables
```

---

## Installation & Setup

### **Prerequisites**
Before you begin, make sure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Composer](https://getcomposer.org/)

### **Clone the repository**

```sh
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### **Create a .env file**
Create a .env file in the root directory and add the required environment variables:

```sh
WORDPRESS_DB_HOST=mysql
WORDPRESS_DB_USER=root
WORDPRESS_DB_PASSWORD=root
WORDPRESS_DB_NAME=wordpress
MYSQL_DATABASE=wordpress
MYSQL_ROOT_PASSWORD=root
```

### **Start the Containers**
Run the following command to build and start WordPress:

```sh
docker-compose up -d --build
```

### **Access WordPress**
Once the containers are running, open:

- WordPress: http://localhost:8000
- phpMyAdmin: http://localhost:8081

### **Required Plugins**
These plugins are pre-installed in the container:

- Classic Editor
- SASS to CSS Compiler
- ACF to REST API
- Advanced Custom Fields PRO
- WP REST API Controller

### **Development Commands**

**Rebuild the Containers**
```sh
docker-compose up -d --build
```

**Stop the Containers**
```sh
docker-compose down
```

**View Logs**
```sh
docker-compose logs -f
```

**Run WP-CLI Commands**
```sh
docker-compose exec wordpress wp plugin list
```

**Reset Everything (Delete Database)**
```sh
docker-compose down -v
```

### **Troubleshooting**

**Database Connection Issues**
```sh
docker-compose ps
docker-compose restart mysql
```

**Permission Issues**
```sh
docker-compose exec wordpress chown -R www-data:www-data /var/www/html
```