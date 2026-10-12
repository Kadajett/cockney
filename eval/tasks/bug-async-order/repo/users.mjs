import { fetchAll, uniqueIds } from "./loader.mjs";

/** Load user records for the "recent activity" widget. */
export async function loadUsers(api, ids) {
  return fetchAll(uniqueIds(ids), (id) => api.getUser(id));
}

export async function loadUserNames(api, ids) {
  const users = await loadUsers(api, ids);
  return users.map((u) => u.name);
}
