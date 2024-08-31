<h1 align="center"> Projeto Measurement App - Backend </h1>

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![REST](https://img.shields.io/badge/REST%20API-%231572B6.svg?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

<p align="center">> Status do Projeto: Em Desenvolvimento :computer:</p>

## Como rodar a aplicação:

1. No terminal, clone o projeto:

   > git clone https://github.com/matheusmantini/measurement-app-backend.git

2. Entre na pasta do projeto:

   > cd measurement-app-backend

3. Crie um arquivo .env na raiz do projeto, usando a variável que está em .env.example e substituindo-a com a sua API KEY do GEMINI:

4. Execute a aplicação em docker:

   > docker compose build && docker compose up -d

5. Pronto, agora é possível acessar as rotas a partir da url base: http://localhost:5000/

## Funcionalidades da API

- **POST /upload**

  **Responsável por receber uma imagem em base 64, consultar o Gemini e retornar a medida lida pela API**

  - **Request Body**
    ```json
    {
    "image": "base64",
    "customer_code": "string",
    "measure_datetime": "datetime",
    "measure_type": "WATER" ou "GAS"
    }
    ```
  - **Success Returns**
    ```json
    {
    "image": "base64",
    "customer_code": "string",
    "measure_datetime": "datetime",
    "measure_type": "WATER" ou "GAS"
    }
    ```

---

- **PATCH /confirm**

  **Responsável por confirmar ou corrigir o valor lido pelo LLM**

  - **Request Body**
    ```json
    {
      "measure_uuid": "string",
      "confirmed_value": "integer"
    }
    ```
  - **Success Returns**
    ```json
    {
      "“success”:": "true"
    }
    ```

---

- **GET /:{customer code}:/list**

  **Responsável por listar as medidas realizadas por um determinado cliente. Pode listar todas ou filtrar pelo tipo: WATER ou GAS**

  - **Request Example**
    ```json
    {url base}/<customer code>/list?measure_type=WATER
    ```
  - **Success Returns**
    ```json
    {
    "customer_code": "string",
    "measures": [
        {
        "measure_uuid": "string",
        "measure_datetime": "datetime",
        "measure_type": "string",
        "has_confirmed": "boolean",
        "image_url": "string"
        },
        {
        "measure_uuid": "string",
        "measure_datetime": "datetime",
        "measure_type": "string",
        "has_confirmed": "boolean",
        "image_url": "string"
        }
    ]
    }

## Desenvolvedor

| [<img src="https://avatars.githubusercontent.com/u/71985890?v=4" width=115 > <br> <sub> Matheus Mantini </sub>](https://www.linkedin.com/in/matheusmantini/) |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------: |
