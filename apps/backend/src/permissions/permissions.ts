import { appFactory } from "../app-factory";
import { aiSummaryFeatureName } from "./ai-summary-permissions";

export type FeaturePermissionName = typeof aiSummaryFeatureName;

export const featurePermissionsApp = appFactory
  .createApp()
  .get("/feature-permissions", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const permissions = await c.get("prisma").featurePermission.findMany({
      where: {
        users: {
          some: {
            id: user.id,
          },
        },
      },
    });

    return c.json({ permissions });
  });
