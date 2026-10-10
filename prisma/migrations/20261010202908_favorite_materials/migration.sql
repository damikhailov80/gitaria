-- CreateTable
CREATE TABLE "favorite_material" (
    "userId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorite_material_pkey" PRIMARY KEY ("userId","materialId")
);

-- AddForeignKey
ALTER TABLE "favorite_material" ADD CONSTRAINT "favorite_material_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
