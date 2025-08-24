# Portfolio Tracker v2 📈

Aplicação moderna para gerenciamento de carteira de investimentos com stack completa FastAPI + React + TypeScript.

## 🚀 Stack Tecnológica

### Backend
- **FastAPI** - Framework web moderno para APIs
- **SQLAlchemy** - ORM para banco de dados
- **PostgreSQL/SQLite** - Banco de dados
- **Pydantic** - Validação de dados
- **JWT** - Autenticação
- **yfinance** - Dados de mercado
- **Uvicorn** - Servidor ASGI

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **TailwindCSS** - Framework CSS
- **TanStack Query** - Cache e sincronização de dados
- **Zustand** - Gerenciamento de estado
- **React Router** - Roteamento
- **Headless UI** - Componentes acessíveis
- **Heroicons** - Ícones
- **Recharts** - Gráficos

## 📁 Estrutura do Projeto

```
portfolio-tracker-v2/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/     # Endpoints da API
│   │   ├── core/                 # Configurações core
│   │   ├── models/               # Modelos SQLAlchemy
│   │   ├── schemas/              # Schemas Pydantic
│   │   ├── services/             # Lógica de negócio
│   │   └── main.py              # App principal
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── hooks/               # Custom hooks
│   │   ├── pages/               # Páginas da aplicação
│   │   ├── services/            # Serviços de API
│   │   ├── store/               # Stores Zustand
│   │   ├── types/               # Tipos TypeScript
│   │   ├── utils/               # Utilitários
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🔧 Funcionalidades

### ✅ Implementadas
- **Autenticação JWT** - Login/Registro seguro
- **Gerenciamento de Portfolios** - CRUD completo
- **Transações** - Compra/venda de ativos
- **Dados de Mercado** - Cotações em tempo real
- **Dashboard** - Visão geral da carteira
- **Autocomplete de Símbolos** - Busca inteligente
- **Cálculos Automáticos** - P&L, preço médio, estatísticas
- **UI Responsiva** - Design moderno com Tailwind
- **TypeScript** - Tipagem completa end-to-end
- **Cache Inteligente** - TanStack Query para performance

### 🔄 Em Desenvolvimento
- **WebSocket** - Atualizações em tempo real
- **Gráficos Avançados** - Performance histórica
- **Notificações** - Alertas de preço
- **Múltiplas Moedas** - Suporte USD/BRL
- **Análise de Risco** - Métricas avançadas

## 🚀 Como Executar

### Pré-requisitos
- Python 3.12+
- Node.js 18+
- uv (gerenciador de pacotes Python)

### Backend
```bash
cd backend
uv sync
uv run python run.py
```
**API:** http://localhost:8000  
**Docs:** http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
**App:** http://localhost:5174

## 📚 Endpoints da API

### Autenticação
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Registro

### Portfolios
- `GET /api/v1/portfolios` - Listar portfolios
- `POST /api/v1/portfolios` - Criar portfolio
- `GET /api/v1/portfolios/{id}` - Buscar portfolio
- `PUT /api/v1/portfolios/{id}` - Atualizar portfolio
- `DELETE /api/v1/portfolios/{id}` - Deletar portfolio

### Transações
- `GET /api/v1/transactions` - Listar transações
- `POST /api/v1/transactions` - Criar transação
- `PUT /api/v1/transactions/{id}` - Atualizar transação
- `DELETE /api/v1/transactions/{id}` - Deletar transação

### Dados de Mercado
- `GET /api/v1/market/symbols/search` - Buscar símbolos
- `GET /api/v1/market/symbols/validate/{symbol}` - Validar símbolo
- `POST /api/v1/market/prices/current` - Cotações atuais
- `GET /api/v1/market/prices/historical/{symbol}` - Histórico
- `GET /api/v1/market/market/summary` - Resumo do mercado

## 🔒 Segurança

- **JWT Authentication** - Tokens seguros
- **CORS** - Configurado para desenvolvimento
- **Validação** - Pydantic + TypeScript
- **Rate Limiting** - Proteção contra abuso
- **HTTPS Ready** - Preparado para produção

## 🧪 Testes

```bash
# Backend
cd backend
uv run pytest

# Frontend
cd frontend
npm run test
```

## 🚀 Deploy

### Backend (Railway/Heroku/DigitalOcean)
```bash
# Configurar variáveis de ambiente
export DATABASE_URL="postgresql://..."
export SECRET_KEY="your-secret-key"

# Deploy
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Configurar VITE_API_BASE_URL para produção
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- **FastAPI** - Framework incrível para APIs
- **React** - Biblioteca UI poderosa
- **TailwindCSS** - CSS utilitário fantástico
- **TanStack Query** - Gerenciamento de estado servidor
- **yfinance** - Dados de mercado gratuitos