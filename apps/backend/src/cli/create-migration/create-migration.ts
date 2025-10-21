import { execSync } from "child_process";
import fs from "fs";
import path from "path";

type MigrationFileName = `${string}_${string}.sql`;

export function getNewMigrationName(): string {
  const name = process.argv[2];

  if (!name) {
    console.error(`
      Error: Please provide a name for the migration.
      Usage: npm run db:create-migration <migration-name>
      Example: npm run db:create-migration "add-user-table"
      `);
    process.exit(1);
  }

  return name;
}

export function getNewMigrationFileName({
  migrationName,
  migrationFileNames,
}: {
  migrationName: string;
  migrationFileNames: string[];
}): MigrationFileName {
  const nextMigrationNumber = getLastMigrationNumber(migrationFileNames) + 1;
  const formattedNextMigrationNumber = nextMigrationNumber
    .toString()
    .padStart(4, "0");

  return `${formattedNextMigrationNumber}_${migrationName}.sql` as const;
}

export function checkIsInitialMigration(migrationFileNames: string[]): boolean {
  return migrationFileNames.length === 0;
}

export function getOutputPath({
  migrationsDir,
  fileName,
}: {
  migrationsDir: string;
  fileName: MigrationFileName;
}): string {
  return path.join(migrationsDir, fileName);
}

export function getNewMigrationCommand({
  isInitialMigration,
  outputPath,
}: {
  isInitialMigration: boolean;
  outputPath: string;
}): string {
  const schemaPath = path.resolve(process.cwd(), "prisma/schema.prisma");
  const prismaMigrateFromFlag = isInitialMigration
    ? "--from-empty"
    : "--from-local-d1";

  const command = `prisma migrate diff ${prismaMigrateFromFlag} --to-schema-datamodel ${schemaPath} --script --output ${outputPath}`;

  return command;
}

export function executeNewMigrationCommand({
  command,
  fileName,
}: {
  command: string;
  fileName: MigrationFileName;
}): void {
  try {
    console.log(`Generating migration: ${fileName}`);
    execSync(command, { stdio: "inherit" });
    console.log("Migration generated successfully.");
  } catch (error) {
    console.error("Error generating migration:", error);
    process.exit(1);
  }
}

export function getMigrationsDir(): string {
  return path.resolve(process.cwd(), "migrations");
}

export function getMigrationFileNames(migrationsDir: string): string[] {
  const migrationFiles = fs.readdirSync(migrationsDir);

  return migrationFiles.filter((file) => /^\d{4}_.*\.sql$/.test(file));
}

function getLastMigrationNumber(migrationFileNames: string[]): number {
  const lastMigrationNumber =
    migrationFileNames
      .map((file) => parseInt(file.split("_")[0]))
      .filter((number) => !isNaN(number))
      .sort((a, b) => b - a)[0] || 0;

  return lastMigrationNumber;
}
