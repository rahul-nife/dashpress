import { setupApiHandlers } from "./setup";
import { accountApiHandlers } from "./account";
import { authApiHandlers } from "./auth";
import { entitiesApiHandlers } from "./entities";
import { dataApiHandlers } from "./data";
import { rolesApiHandlers } from "./roles";
import { configApiHandlers } from "./config";
import { dashboardApiHandlers } from "./dashboard";
import { integrationsApiHandlers } from "./integrations";
import { versionApiHandlers } from "./versions";
import { portalApiHandlers } from "./portal";
import { menuApiHandlers } from "./menu";
import { userPreferencesApiHandlers } from "./user-preferences";

export const apiHandlers = [
  ...setupApiHandlers,
  ...authApiHandlers,
  ...accountApiHandlers,
  ...entitiesApiHandlers,
  ...dataApiHandlers,
  ...integrationsApiHandlers,
  ...rolesApiHandlers,
  ...configApiHandlers,
  ...dashboardApiHandlers,
  ...versionApiHandlers,
  ...portalApiHandlers,
  ...menuApiHandlers,
  ...userPreferencesApiHandlers,
];
