import { USER_FETCH_URL } from "@/types/user";
import { apiFetch } from "@/lib/apiFetch";

export async function fetch_User(id: string): Promise<Response> {
  return await apiFetch(`${USER_FETCH_URL}/${id}`);
}