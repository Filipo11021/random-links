import { execSync } from "child_process";

export type MigrationTarget = "local" | "remote";

export function parseApplyMigrationsTarget(
  target: string,
):
  | { success: true; value: MigrationTarget }
  | { success: false; error: string } {
  if (target !== "--local" && target !== "--remote") {
    return {
      success: false,
      error: `
      Error: Please provide a target environment flag.
      Usage: npm run db:apply-migration <flag>
      Example: npm run db:apply-migration --local
      Available flags: --local, --remote
      `,
    };
  }

  return {
    success: true,
    value: target.substring(2) as MigrationTarget,
  };
}

export function getMigrationsTarget(): MigrationTarget {
  const parseResult = parseApplyMigrationsTarget(process.argv[2]);

  if (!parseResult.success) {
    console.error(parseResult.error);
    process.exit(1);
  }

  return parseResult.value;
}

export function createApplyMigrationsCommand(target: MigrationTarget): string {
  const command = `npx wrangler d1 migrations apply random-links --${target}`;
  return command;
}

export function executeApplyMigrationCommand({
  command,
  target,
}: {
  command: string;
  target: MigrationTarget;
}): void {
  try {
    console.log(`Applying migrations for ${target}...`);
    execSync(command, { stdio: "inherit" });
    console.log("Migrations applied successfully.");
  } catch (error) {
    console.error("Error applying migration:", error);
    process.exit(1);
  }
}
