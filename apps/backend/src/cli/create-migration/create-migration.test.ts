import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  checkIsInitialMigration,
  getNewMigrationFileName,
  getOutputPath,
} from "./create-migration";

function getMigrationsFileNamesForTest(
  numberOfMigrations: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
): string[] {
  const migrationsFileNames: string[] = [];

  for (let i = 1; i <= numberOfMigrations; i++) {
    migrationsFileNames.push(`000${i}_test-migration_${i}.sql`);
  }

  return migrationsFileNames;
}

describe("get output path for migration", () => {
  it("should correctly generate the output path for an initial migration", () => {
    const migrationName = "add-user-table";
    const migrationFileNames: string[] = getMigrationsFileNamesForTest(0);
    const newMigrationFileName = getNewMigrationFileName({
      migrationName,
      migrationFileNames,
    });

    const outputPath = getOutputPath({
      migrationsDir: "migrations",
      fileName: newMigrationFileName,
    });

    assert.equal(outputPath, `migrations/0001_${migrationName}.sql`);
  });

  it("should return true for initial migration when no migration files exist", () => {
    const migrationFileNames: string[] = getMigrationsFileNamesForTest(0);
    const isInitialMigration = checkIsInitialMigration(migrationFileNames);
    assert.equal(isInitialMigration, true);
  });

  it("should return false for initial migration when migration files exist", () => {
    const migrationFileNames: string[] = getMigrationsFileNamesForTest(1);
    const isInitialMigration = checkIsInitialMigration(migrationFileNames);
    assert.equal(isInitialMigration, false);
  });

  it("should correctly generate the output path for a subsequent migration", () => {
    const migrationName = "add-user-table";
    const migrationFileNames: string[] = getMigrationsFileNamesForTest(5);
    const newMigrationFileName = getNewMigrationFileName({
      migrationName,
      migrationFileNames,
    });

    const outputPath = getOutputPath({
      migrationsDir: "migrations",
      fileName: newMigrationFileName,
    });

    assert.equal(outputPath, `migrations/0006_${migrationName}.sql`);
  });
});
