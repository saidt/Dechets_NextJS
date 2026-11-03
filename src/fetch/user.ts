import { USER_FETCH_URL } from "@/types/user";

export async function fetch_User(id: string): Promise<Response> {
  return await fetch(`${USER_FETCH_URL}/${id}`);
}