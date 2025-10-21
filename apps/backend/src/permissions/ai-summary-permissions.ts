import { PrismaClient } from "../generated/prisma";

const aiSummaryFeatureName = "ai_summary";

export async function canCreateAiSummary({
  userId,
  prisma,
  link,
}: {
  userId: string;
  prisma: PrismaClient;
  link: { userId: string };
}): Promise<boolean> {
  const isFeatureEnabled = await isAiSummaryEnabledForUser({
    userId,
    prisma,
  });
  const isLinkOwner = userId === link.userId;

  return isFeatureEnabled && isLinkOwner;
}

async function isAiSummaryEnabledForUser({
  userId,
  prisma,
}: {
  userId: string;
  prisma: PrismaClient;
}): Promise<boolean> {
  const featurePermission = await prisma.featurePermission.findFirst({
    where: {
      featureName: aiSummaryFeatureName,
      users: {
        some: {
          id: userId,
        },
      },
    },
  });

  return Boolean(featurePermission);
}
