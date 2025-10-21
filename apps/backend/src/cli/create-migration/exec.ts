import {
  checkIsInitialMigration,
  executeNewMigrationCommand,
  getMigrationFileNames,
  getMigrationsDir,
  getNewMigrationCommand,
  getNewMigrationFileName,
  getNewMigrationName,
  getOutputPath,
} from "./create-migration";

const migrationsDir = getMigrationsDir();
const migrationFileNames = getMigrationFileNames(migrationsDir);

const newMigrationName = getNewMigrationName();
const newMigrationFileName = getNewMigrationFileName({
  migrationName: newMigrationName,
  migrationFileNames,
});

const newMigrationCommand = getNewMigrationCommand({
  isInitialMigration: checkIsInitialMigration(migrationFileNames),
  outputPath: getOutputPath({
    migrationsDir,
    fileName: newMigrationFileName,
  }),
});

executeNewMigrationCommand({
  command: newMigrationCommand,
  fileName: newMigrationFileName,
});
