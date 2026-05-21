-- pgvector column for similarity search (pre-filter by course_id before ORDER BY distance)
ALTER TABLE "ai_document_chunks" ADD COLUMN IF NOT EXISTS "embedding" vector(1536);

-- Library assets (S3 keys + enrollment gate)
CREATE TABLE "library_assets" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "s3_key" TEXT NOT NULL,
    "requires_enrollment" BOOLEAN NOT NULL DEFAULT true,
    "track_slug" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_assets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "library_assets_slug_key" ON "library_assets"("slug");
