-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('FREE', 'PRO', 'TEAM');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subscriptionType" "SubscriptionType" NOT NULL DEFAULT 'FREE';
