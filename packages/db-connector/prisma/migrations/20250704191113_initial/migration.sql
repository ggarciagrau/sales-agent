CREATE EXTENSION IF NOT EXISTS vector; 

-- CreateTable
CREATE TABLE "guidelines" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "is_global" BOOLEAN NOT NULL DEFAULT false,
    "embedding" vector(384),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guidelines_pkey" PRIMARY KEY ("id")
);
