/*
  Warnings:

  - Changed the type of `expires_access_token` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `expires_refresh_token` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "expires_access_token",
ADD COLUMN     "expires_access_token" INTEGER NOT NULL,
DROP COLUMN "expires_refresh_token",
ADD COLUMN     "expires_refresh_token" INTEGER NOT NULL;
