# API Service

Este repositório contém a implementação de um serviço de API RESTful com operações de CRUD (Create, Read, Update, Delete) integradas a um banco de dados.

## Funcionalidades

A API fornece os seguintes endpoints com suas respectivas funções:

- **GET**: Retorna todos os registros ou um registro específico do banco de dados.
- **POST**: Insere um novo registro no banco de dados.
- **PUT / PATCH**: Atualiza registros existentes (todos ou parcialmente).
- **DELETE**: Remove um registro do banco de dados.

## Uso de códigos de status HTTP:

- **200 OK**: Sucesso
- **201 Created**: Recurso criado com sucesso
- **400 Bad Request**: Erro na requisição
- **401 Unauthorized**: Falta de autenticação
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro no servidor

## Configuração(.env)

- DATABASE_URL= 
- PORT= 

### Pré-requisitos

- Node.js instalado (versão 16 ou superior).
- Gerenciador de pacotes `npm`

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/api_services.git
   cd API_Gateway
   npm install
   npm run dev
   ```
