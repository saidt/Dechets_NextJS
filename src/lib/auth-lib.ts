import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { exists_User_Role } from '@/app/db-data/user-role';

export async function checkRole(roleId: string): Promise<Boolean> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const role = roleId.trim().toUpperCase();

  if (userId && (await exists_User_Role(userId, role))) {
    return true;
  }

  return false;
}