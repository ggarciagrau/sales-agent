# 🦜 Budgerigar Sales Agent - Guideline-Aware AI Agent

<div align="center">
  <img src="./docs/images/budgie-agent.png" alt="Budgie agent" width="200">
</div>

A sophisticated AI-powered sales agent that dynamically incorporates behavioral guidelines into its responses based on vector similarity search. This system demonstrates how to create basic context-aware AI agents that follow specific behavioral rules.

## 🎯 What It Does

This application implements a **guideline-aware AI agent** that:

- **Dynamically retrieves relevant guidelines** from a PostgreSQL database using vector similarity search
- **Constructs context-aware prompts** by combining global and situational guidelines
- **Provides intelligent sales assistance** for budgerigar purchases and care advice
- **Adapts its behavior** based on user context and conversation history

The agent specializes in selling budgerigars (parakeets) and related products, following a structured sales process while maintaining animal welfare standards.

## 🏗️ Architecture & Technical Elements

### **Monorepo Structure**
```
apps/
├── backend/          # NestJS REST API
└── frontend/         # Vue 3 + TypeScript SPA
packages/
├── db-connector/     # Prisma ORM + PostgreSQL schema
├── generate-embedding/ # Vector embedding generation
└── prompt-builder/   # Dynamic prompt construction
tools/
└── bootstrap/        # Automated setup and data seeding
```

### **Key Technical Components**

**1. Vector-Based Guideline Retrieval**
- Uses PostgreSQL with pgvector extension for efficient similarity search
- Generates embeddings using `all-roberta-large-v1` model
- Retrieves top 5 most relevant guidelines based on user message context

**2. Dynamic Prompt Construction**
- Two-tier guideline system: Global (always active) + Dynamic (context-specific)
- Template-based prompt building with placeholder replacement
- Contextual guideline injection based on conversation semantics

**3. Database Schema**
- Guidelines table with vector embeddings, categories, priorities
- Session-based chat history storage
- Automatic embedding generation and indexing

**4. AI Integration**
- OpenAI API for chat completions and conversation summarization
- Local embedding generation for privacy and performance
- Context-aware response generation

## 🚀 Local Deployment Instructions

### **Prerequisites**
- Node.js 22 (use `.nvmrc` for version management)
- pnpm package manager
- Docker and Docker Compose
- OpenAI API key

### **1. Clone and Install**
```bash
git clone <repository-url>
cd sales-agent
nvm use  # Sets Node.js 22
npm install -g pnpm
pnpm install
```

### **2. Environment Setup**
Create `.env` files in the respective directories:

**`apps/backend/.env`:**
```env
OPENAI_API_KEY="your-openai-api-key"
```

**`packages/db-connector/.env`:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sales_agent"
```

### **3. Database Setup and Seed**
Run:
```bash
pnpm bootstrap
```

### **4. Start the Applications**
```bash
# Terminal 1: Start backend
pnpm run dev:backend

# Terminal 2: Start frontend
pnpm run dev:frontend
```

### **5. Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🎮 Usage Example

1. **Open the chat interface** at http://localhost:5173
2. **Ask questions** like:
   - "I'm interested in buying a budgerigar"
   - "What should I know about bird care?"
   - "Do you have any special offers?"
3. **Watch the agent respond** with contextually appropriate guidelines
4. **Observe behavior adaptation** based on conversation flow

## 🔧 Development Commands

### **Backend (NestJS)**
```bash
pnpm --filter backend run build     # Build
pnpm --filter backend run test      # Run tests
pnpm --filter backend run lint      # Lint code
pnpm --filter backend run format    # Format code
```

### **Frontend (Vue 3)**
```bash
pnpm --filter frontend run build    # Build for production
pnpm --filter frontend run preview  # Preview build
```

### **Database Operations**
```bash
cd packages/db-connector
pnpm run db:migrate    # Run migrations
pnpm run db:studio     # Open Prisma Studio
pnpm run db:reset      # Reset database
```

## 🧠 How It Works

### **Guideline Retrieval Process**
1. User sends a message
2. System generates embedding for the message
3. Vector similarity search finds relevant guidelines
4. Global guidelines are always included
5. Top 5 contextually relevant guidelines are retrieved

### **Prompt Construction**
1. Base system prompt with sales agent role
2. Global guidelines insertion
3. Dynamic guidelines insertion based on context
4. Conversation history summarization
5. Final prompt sent to OpenAI

### **Sample Guidelines**
The system includes 62 pre-loaded guidelines covering:
- **Tone & Communication**: Professional, empathetic responses
- **Health & Welfare**: Animal care priorities
- **Sales Process**: Discovery, presentation, closing techniques
- **Product Knowledge**: Budgerigar care, accessories, pricing
- **Policy & Compliance**: Legal requirements, guarantees

## 📊 Data Model

### **Guidelines Table**
```sql
CREATE TABLE guidelines (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  category    TEXT NOT NULL,
  priority    INTEGER NOT NULL,
  active      BOOLEAN DEFAULT true,
  isGlobal    BOOLEAN DEFAULT false,
  embedding   vector(1024),
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Key Features

- **Vector Similarity Search**: Semantic guideline matching using pgvector
- **Real-time Chat Interface**: Professional Vue 3 chat component
- **Context-Aware Responses**: Guidelines applied based on conversation context
- **Automated Setup**: One-command deployment with Docker
- **Responsive Design**: Mobile-friendly interface
- **Session Management**: Conversation history and context retention
- **Extensible Architecture**: Easy to add new guidelines and behaviors

## 🔍 Technical Decisions & Trade-offs

### **What I Built**
- **Vector embeddings** for semantic guideline matching (more sophisticated than keyword matching)
- **Two-tier guideline system** for flexibility (global + contextual)
- **Local embedding generation** for privacy and cost efficiency
- **Monorepo structure** for code organization and reusability
- **TypeScript throughout** for type safety and developer experience

### **What I'd Build Next**
- **Guideline management UI** for non-technical users
- **A/B testing framework** for guideline effectiveness
- **Reinforcement learning** for guideline selection and ranking
- **Analytics dashboard** for conversation insights
- **Multi-tenant support** for different sales domains
- **Advanced caching** for embedding generation and retrieval
- **Fine-tuned models** for domain-specific understanding
- **RAG optimization** with hybrid search (dense + sparse vectors)
- **Dynamic embedding models** that adapt to conversation context
- **Multi-modal AI support** for processing images, documents, and voice
- **Guideline prioritization and categorization** with automatic taxonomy generation

---

**Built with ❤️ during a Friday afternoon and a weekend in my spare time.**

This project demonstrates rapid prototyping, architectural decision-making, and the ability to turn fuzzy concepts into functional systems. The guideline-aware AI agent showcases how modern AI can be made more controllable and context-aware through intelligent prompt engineering and vector search.