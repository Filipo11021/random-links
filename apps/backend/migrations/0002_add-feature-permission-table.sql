-- CreateTable
CREATE TABLE "FeaturePermission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "featureName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_FeaturePermissionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FeaturePermissionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "FeaturePermission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FeaturePermissionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FeaturePermission_featureName_key" ON "FeaturePermission"("featureName");

-- CreateIndex
CREATE UNIQUE INDEX "_FeaturePermissionToUser_AB_unique" ON "_FeaturePermissionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FeaturePermissionToUser_B_index" ON "_FeaturePermissionToUser"("B");
