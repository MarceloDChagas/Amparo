# Amparo

Guia rapido para rodar o projeto localmente com a infraestrutura em Docker e o backend/frontend em terminais separados.

## Como rodar

### 1. Pre-requisitos

- Node.js 20+
- Docker Desktop
- npm

### 2. Configurar os arquivos de ambiente

Na raiz do projeto, crie o arquivo `.env` a partir de `.env.example`.

No backend, crie o arquivo `backend/.env` a partir de `backend/.env.example`.

Valores importantes no `backend/.env`:

- `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/amparo?schema=public"`
- `PORT=3000`
- `MINIO_ENDPOINT=localhost`
- `MINIO_PORT=9000`
- `MINIO_USE_SSL=false`
- `MINIO_ROOT_USER=minioadmin`
- `MINIO_ROOT_PASSWORD=minioadmin`
- `MINIO_BUCKET_NAME=amparo-docs`
- `JWT_SECRET`
- `ENCRYPTION_KEY`

Opcionalmente, voce pode trocar o admin criado pelo seed com estas variaveis:

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `SEED_ADMIN_NAME`

No frontend, crie `frontend/.env.local` com este conteudo:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:3000
```

### 3. Subir a infraestrutura com Docker

O backend precisa de Postgres e MinIO. Para desenvolvimento local, suba os servicos de apoio com:

```bash
docker compose up -d db pgadmin minio
```

Servicos disponiveis:

- API backend local: `http://localhost:3000`
- Frontend local: `http://localhost:3001`
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:5050`
- MinIO API: `http://localhost:9000`
- MinIO Console: `http://localhost:9001`

### 4. Rodar o backend em um terminal

```bash
cd backend
npm install
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

O backend sobe por padrao em `http://localhost:3000` e a documentacao Swagger fica em `http://localhost:3000/api/docs`.

### 5. Rodar o frontend em outro terminal

```bash
cd frontend
npm install
npm run dev -- --port 3001
```

Abra `http://localhost:3001` no navegador.

## Usuario admin criado pelo seed

Ao executar `npx prisma db seed`, o seed cria ou atualiza um usuario administrador.

Credenciais padrao:

- Email: `admin@amparo.local`
- Senha: `Admin@123`

Se quiser alterar essas credenciais, ajuste no `backend/.env`:

```env
SEED_ADMIN_EMAIL=admin@amparo.local
SEED_ADMIN_PASSWORD=Admin@123
SEED_ADMIN_NAME=Administrador
```

O seed tambem cria um usuario de teste do tipo `VICTIM` e popula ocorrencias iniciais sem duplicar os registros quando o seed for executado novamente.

## Parar a infraestrutura

```bash
docker compose down
```

Se quiser remover os volumes do banco e do MinIO:

```bash
docker compose down -v
```
