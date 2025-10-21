import {
  createApplyMigrationsCommand,
  executeApplyMigrationCommand,
  getMigrationsTarget,
} from "./apply-migrations";

const target = getMigrationsTarget();
const command = createApplyMigrationsCommand(target);
executeApplyMigrationCommand({ command, target });
