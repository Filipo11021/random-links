import type { FeaturePermissionName } from "@repo/backend";
import { err, ok, type Result } from "@repo/type-safe-errors";
import { apiClient } from "./api-client";
import { createQuery } from "./cache";

type FeaturePermission = {
  id: string;
  featureName: string;
  createdAt: string;
  updatedAt: string;
};

async function getAllFeaturePermissions(): Promise<
  Result<FeaturePermission[], string>
> {
  const res = await apiClient["feature-permissions"].$get();
  const data = await res.json();

  if ("error" in data) return err(data.error);

  return ok(data.permissions);
}

export const featurePermissionsQuery = createQuery({
  cacheKey: "feature-permissions",
  fetcher: getAllFeaturePermissions,
});

export function hasFeaturePermission(
  featureName: FeaturePermissionName,
  featurePermissions: FeaturePermission[],
): boolean {
  return featurePermissions.some(
    (permission) => permission.featureName === featureName,
  );
}
