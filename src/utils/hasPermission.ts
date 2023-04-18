import { useAdminInfoStore } from "@/store";
export const hasPermission = (
  permission: number | number[] | undefined
): boolean => {
  if (!permission) return true;
  const _permission = [permission].flat().filter(Boolean)
  const mainStore = useAdminInfoStore()
  if (mainStore.route_list?.some((item) => _permission.includes(item)))
    return true;
  return false;
};
