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

export async function exists_User_Role(userId: string, roleId: string): Promise<Boolean> {
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