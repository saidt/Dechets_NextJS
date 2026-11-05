import { DEFAULT_PAGE_SIZE } from "@/lib/consts";
import { prisma } from "@/lib/prisma";
import { PrismaQuery } from "@/lib/types";
import { User_Table_Filter_Type } from "@/types/user-table-filter";

export async function user_Table_Filter_Count(whereClause: any): Promise<number> {
  //consoleInfo('user_Table_Filter_Count whereClause: ', JSON.stringify(whereClause));
  const where: any = whereClause ? whereClause : {};
  const rowCount = await prisma.user_Table_Filter.count({
    where
  })
  return Promise.resolve(rowCount);
}

export async function user_Table_Filter_List(params: PrismaQuery): Promise<any> {
  //consoleInfo('user_Table_Filter_List params: ', JSON.stringify(params));
  const { skip = 0, take = DEFAULT_PAGE_SIZE, orderBy = {}, where = {} } = params;
  const rows = await prisma.user_Table_Filter.findMany({
    where,
    orderBy,
    skip,
    take
  });

  return Promise.resolve(rows);
}

export async function read_User_Table_Filter(
  userId: string,
  tableName: string,
  filterName: string,
): Promise<User_Table_Filter_Type[]> {
  const fetched = await prisma.user_Table_Filter.findMany({
    where: {
      user_id: userId,
      table_name: tableName,
      filter_name: filterName
    }
  })

  //consoleInfo('fetch_User_Table_Filter fetched: ', fetched)

  return JSON.parse(JSON.stringify(fetched));
}

export async function exists_User_Table_Filter(
  userId: string,
  tableName: string,
  filterName: string
): Promise<boolean> {
  //consoleInfo('exists_User_Table_Filter userId: ', userId)
  //consoleInfo('exists_User_Table_Filter tableName: ', tableName)
  //consoleInfo('exists_User_Table_Filter filterName: ', filterName)
  const data = await read_User_Table_Filter(userId, tableName, filterName)
  return data.length > 0
}

export async function exists_User_Table_Filter_SameFilter(
  userId: string,
  tableName: string,
  filter: string
): Promise<boolean> {
  //consoleInfo('exists_User_Table_Filter_SameFilter userId: ', userId)
  //consoleInfo('exists_User_Table_Filter_SameFilter tableName: ', tableName)
  //consoleInfo('exists_User_Table_Filter_SameFilter filter: ', filter)

  const count = await prisma.user_Table_Filter.count({
    where: {
      user_id: userId,
      table_name: tableName,
      filter: filter
    }
  })

  return count > 0
}

export async function create_User_Table_Filter(
  userTableFilter: User_Table_Filter_Type
): Promise<User_Table_Filter_Type> {

  //consoleInfo('insertUserTableFilter userTableFilter: ', userTableFilter);
  const { id, ...umpData }: User_Table_Filter_Type = userTableFilter;

  const inserted = await prisma.user_Table_Filter.create({
    data: umpData
  });
  return JSON.parse(JSON.stringify(inserted));
}

export async function update_User_Table_Filter(
  userId: string,
  tableName: string,
  filterName: string,
  filter: string
) {
  //consoleInfo('update_User_Table_FilterSort userId: ', userId)
  //consoleInfo('update_User_Table_FilterSort tableName: ', tableName)
  //consoleInfo('update_User_Table_FilterSort filterName: ', filterName)
  //consoleInfo('update_User_Table_FilterSort filter: ', filter)

  const existsSameFilter = await exists_User_Table_Filter_SameFilter(userId, tableName, filter)
  if (existsSameFilter) {
    //consoleInfo("update_User_Table_Filter existsSameFilter !")
    return {
      success: false,
      error: 'Filter with same expression exists !'
    }
  }

  const exists = await exists_User_Table_Filter(userId, tableName, filterName)
  //consoleInfo("update_User_Table_Filter exists_User_Table_Filter :", exists)
  if (!exists) {
    const inserted = create_User_Table_Filter({
      id: 0,
      user_id: userId,
      table_name: tableName,
      filter_name: filterName,
      type: "USER",
      filter
    });
    return {
      success: true,
      data: JSON.stringify(inserted)
    }
  }

  const updated = await prisma.user_Table_Filter.update({
    where: {
      user_id_table_name_filter_name: {
        user_id: userId,
        table_name: tableName,
        filter_name: filterName
      }
    },
    data: {
      filter
    }
  })
  return {
    success: true,
    data: JSON.stringify(updated)
  }
}

/** Deletes a filter only if it belongs to userId; returns null if there is no such filter. */
export async function delete_User_Table_Filter(id: number, userId: string): Promise<User_Table_Filter_Type | null> {
  //consoleInfo('delete_User_Table_Filter id: ', id);

  const existing = await prisma.user_Table_Filter.findFirst({
    where: { id, user_id: userId }
  })
  if (!existing) {
    return null
  }

  const deleted = await prisma.user_Table_Filter.delete({
    where: {
      id
    }
  })
  return JSON.parse(JSON.stringify(deleted));
}