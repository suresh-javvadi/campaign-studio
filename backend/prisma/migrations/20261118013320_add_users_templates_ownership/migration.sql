-- AlterTable (userId added nullable first; backfilled below, then tightened to NOT NULL)
ALTER TABLE "Project" ADD COLUMN     "templateId" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "partyTag" TEXT NOT NULL DEFAULT 'All Parties',
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "canvasData" JSONB NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Backfill: pre-auth dev/test projects had no owner. Assign them to a
-- placeholder legacy account (password is unusable — a random hash, not a
-- real credential) instead of deleting pre-existing project data.
INSERT INTO "User" ("id", "email", "passwordHash", "name")
VALUES ('legacy-unowned-user', 'legacy@campaignstudio.local', 'unusable-placeholder-hash', 'Legacy Projects')
ON CONFLICT DO NOTHING;

UPDATE "Project" SET "userId" = 'legacy-unowned-user' WHERE "userId" IS NULL;

-- AlterTable: now that every row has an owner, tighten the column.
ALTER TABLE "Project" ALTER COLUMN "userId" SET NOT NULL;
