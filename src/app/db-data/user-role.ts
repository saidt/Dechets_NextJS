import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";

export async function user_Role_Count(whereClause: any): Promise<number> {
  //consoleInfo('user_Role_Count whereClause: ', JSON.stringify(whereClause));
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.user_Role.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function user_Role_List(params: PrismaQuery): Promise<any[]> {
  //consoleInfo('user_Role_List params: ', JSON.stringify(params));
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {} } = params;
  const rows = await prisma.user_Role.findMany({
    where,
    orderBy,
    skip,
    take,
    include: { role: true }
  });

  return Promise.resolve(rows);
}

/*export async function user_RoleId_List(userId: string): Promise<any> {
  //consoleInfo('user_RoleId_List userId: ', userId);
  const data = await prisma.user_Role.findMany({
    where: { user_id: userId },
    include: { role: true }
  });

  return Promise.resolve(data);
}*/

/** True if the user is a super user (USER_.SUPER_USER = 'O'). */
export async function is_Super_User(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { super_user: true },
  });
  return user?.super_user?.trim().toUpperCase() === 'O';
}

/**
 * True if the user may use the role: a super user passes every role check,
 * otherwise the role must be granted in USER_ROLE. Use this for all role checks.
 */
export async function has_User_Role(userId: string, roleId: string): Promise<boolean> {
  return (await is_Super_User(userId)) || (await exists_User_Role(userId, roleId));
}

export async function exists_User_Role(userId: string, roleId: string): Promise<boolean> {
  //consoleInfo('user_RoleId_List userId: ', userId);
  const data = await prisma.user_Role.findMany({
    where: {
      user_id: userId,
      role_id: roleId,
    },
  });

  //consoleInfo('exists_User_Role data.length: ', data.length);

  return data.length > 0;
}