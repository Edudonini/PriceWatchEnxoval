# PriceWatch

Sistema de monitoramento de preços para produtos de enxoval.

## 🚀 Começando

### Pré-requisitos

- Docker e Docker Compose
- .NET 8 SDK
- Node.js 20.x

### Executando localmente

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/pricewatch.git
cd pricewatch
```

2. Inicie os containers:
```bash
docker-compose up -d
```

3. Acesse a aplicação:
- Frontend: http://localhost:4200
- API: http://localhost:5000
- Swagger: http://localhost:5000/swagger
- Hangfire Dashboard: http://localhost:5000/jobs

## 🛠️ CI/CD

O pipeline de CI/CD é executado no GitHub Actions para cada push nas branches `feature/*` e `develop`.

### Jobs

1. **Backend**
   - Build e testes unitários
   - Cobertura de código com Coverlet
   - Upload de relatórios de cobertura

2. **Testes de Integração**
   - Executa testes contra SQL Server Edge
   - Verifica integração com banco de dados

3. **Frontend**
   - Build e testes
   - Geração do bundle de produção

4. **Testes E2E**
   - Executa Playwright contra build de produção
   - Verifica fluxos completos da aplicação

5. **Database**
   - Gera script de migração idempotente

## 📊 Observabilidade

### Logs

Os logs são gerados em:
- Console
- Arquivo: `logs/pricewatch-{date}.log`

### Health Checks

Endpoints disponíveis:
- `/healthz`: Status geral da aplicação
- `/healthz/ready`: Verifica dependências (banco, etc)
- `/healthz/live`: Verifica se a aplicação está viva

### Métricas

Métricas disponíveis em `/metrics`:
- Requisições HTTP
- Tempo de resposta
- Erros
- Conexões com banco

### Tracing

Traces disponíveis via OpenTelemetry:
- Requisições HTTP
- Operações de banco
- Jobs do Hangfire

## 🔒 Autenticação

A API usa JWT para autenticação. Para obter um token:

1. Configure as credenciais no Swagger UI
2. Use o endpoint `/api/auth/login`
3. Cole o token no botão "Authorize"

## 🧪 Testes

### Backend

```bash
# Testes unitários
dotnet test src/Backend/PriceWatch.Tests/PriceWatch.Tests.csproj

# Testes de integração
dotnet test src/Backend/PriceWatch.Tests/PriceWatch.Tests.csproj --filter Category=Integration
```

### Frontend

```bash
# Testes unitários
npm run test

# Testes E2E
npm run e2e
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
