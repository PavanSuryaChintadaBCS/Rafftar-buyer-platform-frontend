/**
 * Utils barrel — re-exports everything from the utils module.
 *
 * Usage examples:
 *   import { ROUTES, APP }                    from "@/utils";
 *   import { QUERY_KEYS, STALE_TIME }         from "@/utils";
 *   import { httpService, mockApi }           from "@/utils";
 *   import { ENDPOINTS, IS_MOCK }             from "@/utils";
 *   import { readStorageItem, writeJsonItem } from "@/utils";
 *   import { INDIAN_STATES }                  from "@/utils";
 *   import { CSS_VARS, ORDER_STATUS_COLORS }  from "@/utils";
 */

export * from "./constants";
export * from "./context";
export * from "./endpoints";
export * from "./http-service";
export * from "./offline-services";
export * from "./state-list";
export * from "./theme-config";
