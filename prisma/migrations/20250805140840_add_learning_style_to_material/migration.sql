-- CreateEnum
CREATE TYPE "public"."LearningStyle" AS ENUM ('VISUAL', 'AUDITORY', 'KINESTHETIC');

-- AlterTable
ALTER TABLE "public"."Material" ADD COLUMN     "learningStyle" "public"."LearningStyle" NOT NULL DEFAULT 'VISUAL';
