# Full Cycle Docker - Nginx Reverse Proxy com Node.js

Oi pessoal, este repositório contém a solução para o desafio Full Cycle que envolve o uso do Nginx como proxy reverso para uma aplicação Node.js. A aplicação interage com um banco de dados MySQL, e o objetivo é criar uma arquitetura utilizando Docker para que tudo funcione de forma integrada.

## Desafio: Nginx como Proxy Reverso para Node.js e MySQL

O objetivo deste desafio foi configurar o Nginx como proxy reverso para uma aplicação Node.js que interage com um banco de dados MySQL. Cada vez que a aplicação é acessada, ela adiciona um registro no banco de dados e exibe a lista de todos os registros armazenados.

### Como Executar

1. Certifique-se de que todos os arquivos estejam organizados conforme a estrutura a seguir:

```
project-root/
├── docker-compose.yml
├── nginx.conf
├── nodeapp/
│   ├── Dockerfile
│   ├── index.js
│   └── package.json
```

2. Execute o comando:

```sh
docker-compose up -d
```

3. Acesse a aplicação na URL: [http://localhost:8080](http://localhost:8080)

Você verá a mensagem:

```
<h1>Full Cycle Rocks!</h1>
```

E uma lista dos nomes cadastrados no banco de dados.

### Docker Compose

O `docker-compose.yml` configura os três serviços: Nginx, Node.js e MySQL. Todos os serviços são conectados por uma rede compartilhada (`app-network`) para garantir a comunicação entre eles.

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - nodeapp
    restart: always
    networks:
      - app-network

  nodeapp:
    build: ./nodeapp
    container_name: nodeapp
    volumes:
      - ./nodeapp:/usr/src/app
      - /usr/src/app/node_modules
    ports:
      - "3000:3000"
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: mysql:5.7
    container_name: db
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: nodedb
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - app-network

volumes:
  db_data:

networks:
  app-network:
    driver: bridge
```

### Arquivo de Configuração do Nginx (`nginx.conf`)

O Nginx foi configurado para repassar as requisições para a aplicação Node.js:

```nginx
events {}

http {
  server {
    listen 80;

    location / {
      proxy_pass http://nodeapp:3000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      proxy_connect_timeout 60s;
      proxy_read_timeout 60s;
    }

    error_log /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;
  }
}

```