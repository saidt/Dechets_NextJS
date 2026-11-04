"use client";

import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { usePathname, useRouter } from "next/navigation";
import { useAppContext } from "@/app/context/AppContext";
import { saveLastViewedId } from "@/services/userSettingsService";
import ToolBarEdit from "./ToolBarEdit";
import ConfirmationDialog from "../ui/dialog/ConfirmationDialog";
import { Column, Mode } from "@/lib/types";
import TitleCard from "../shared/TitleCard";
import { LoadingBar } from "../ui/LoadingBar";
import { emptyStringsToNull, getObjectDifferences, trimStrings } from "@/lib/lib";
import useAuth from "@/app/context/UseAuth";
import { ReportDetail, ReportLayout } from "../pdf/ReportComponent";
import { downloadPdf } from "@/components/pdf/pdfService";
import { clientError, handleError } from "@/lib/error";
import { getResponseData } from "@/lib/html";
import { useSession } from "next-auth/react";
import Loading from "../ui/Loading";
import { serializeDates } from "@/lib/date-utils";

interface GenericShowPageProps<T extends Record<string, any>> {
  tableName: string;
  columns: Column<T>[];
  apiUrl: string;
  entityId: string | number;
  isEditMode: boolean;
  loading?: boolean;
  childUrl?: string;
  optionsMenu?: React.ReactNode[];
  setEditedEntity: (entity: T)=> void;
  setRemoteMode: (value: Mode) => void,
  fetchData?: (id: string | number) => Promise<T>;
  createData?: (data: T) => Promise<T>;
  updateData?: (originalData: T, editedData: T) => Promise<T>;
  deleteData?: (id: string | number) => Promise<T>;
  getDisplayName: (entity: T) => string;
  getId: (entity: T) => string | number;
  getEditedEntity: () => T;
  getNewEntity: () => T;
  getDuplicateEntity: () => T;
  getModifiedWithId: (entity: T, modifiedEntity: Partial<T>) => Partial<T>;
  validate: (entity: T) => boolean;
  children: React.ReactNode;
  onPrint?: (entity: T) => Promise<void>;
}

export function GenericShowPage<T extends Record<string, any>>({
  tableName,
  columns,
  apiUrl,
  entityId,
  isEditMode,
  loading,
  childUrl,
  //masterId,
  optionsMenu,
  setEditedEntity,
  setRemoteMode,
  fetchData,
  createData,
  updateData,
  deleteData,
  getDisplayName,
  getId,
  getEditedEntity,
  getNewEntity,
  getDuplicateEntity,
  getModifiedWithId,
  validate,
  children,
  onPrint,
}: GenericShowPageProps<T>) {

  var startMode : Mode;
  if (entityId === 'null') {
    startMode = "Create"
  }
  else if (isEditMode) {
    startMode = "Edit"
  }
  else {
    startMode = "Browse"
  }

  const [mode, setMode] = useState<Mode>(startMode); 
  const [entity, setEntity] = useState<T>(getNewEntity());
  const [localLoading, setLocalLoading] = useState(mode!=="Create");
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { data: session, status } = useSession()
  const { addNotification, getCurrentUrl } = useAppContext();
  const { hasRole, authLoading } = useAuth();
  const router =  useRouter()

  const curUrl = getCurrentUrl()
  const pathname = usePathname();

  const user = session?.user
  const role = useMemo(() => `${tableName}.SHOW`, [tableName]);
  const authorized = useMemo(() => hasRole(role), [hasRole, role]);

  useEffect(() => {
    if (status !== "loading" && !session) {
      clientError("GenericShowPage: session introuvable", null, curUrl, router);
    }
  }, [status, session, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && (!user || !user.id)) {
      clientError("GenericShowPage: no user data!", null, curUrl, router);
    }
  }, [user, status, authLoading, curUrl, router]);

  useEffect(() => {
    if (status !== "loading" && !authLoading && !authorized) {
      clientError(
        `${tableName}: vous n'avez pas le droit de consulter cette page !`,
        null,
        curUrl || "/",
        router
      );
    }
  }, [status, authLoading, authorized, tableName, curUrl, router]);

  useEffect(() => {
    if (!entity || !getEditedEntity()) {
      handleError('No entity', '', addNotification)
    }
  }, [entity, getEditedEntity, addNotification]);

  const canUpdate = tableName+'.UPDATE'
  const canAdd = tableName+'.ADD'
  const canDelete = tableName+'.DELETE'
  const canPrint = tableName+'.PRINT'

  const internalFetchData = async(id: string | number) : Promise<T> => {
    //consoleInfo('GenericShowPage internalFetchData `${apiUrl}/${id}` : ', `${apiUrl}/${id}`);
    const response  = await apiFetch(`${apiUrl}/${id}`)
    /*, {
      method: "GET",
      headers: {'Content-Type': 'application/json' },
      credentials: 'include',
    });*/

    //consoleInfo('GenericShowPage internalFetchData response : ', response);

    const data : T = await getResponseData(response, 'GenericShowPage internalFetchData')
    //consoleInfo('GenericShowPage internalFetchData data : ', data);
    return data
  }

  const internalCreateData = async(entity: T) : Promise<T> => {
    const id = getId(entity)
    //consoleInfo('GenericShowPage internalCreateData entity : ', entity);
    const response  = await apiFetch(`${apiUrl}/${id}`, {
      method: "POST",
      //headers: {'Content-Type': 'application/json' },
      //credentials: 'include',
      body: JSON.stringify({
        data: entity,
      }),
    });

    const data : T = await getResponseData(response, 'GenericShowPage internalCreateData')
    //consoleInfo('ItemShow internalCreateData data : ', data);
    return data
  }

  const internalUpdateData = async(originalEntity : T, entity : T) : Promise<T> => {
    const modified=getObjectDifferences(originalEntity, entity);
    //consoleInfo('GenericShowPage internalUpdateData modified: ', modified);
    //const modifiedWithId={id: entity.id, ...modified};
    const modifiedWithId=getModifiedWithId(entity, modified);
    //consoleInfo('GenericShowPage internalUpdateData modifiedWithId: ', modifiedWithId);

    const id = getId(originalEntity)

    const response  = await apiFetch(`${apiUrl}/${id}`, {
      method: "PUT",
      //headers: {'Content-Type': 'application/json' },
      //credentials: 'include',
      body: JSON.stringify({
        data: modifiedWithId,
      }),
    });

    const data : T = await getResponseData(response, 'GenericShowPage internalUpdateData')
    //consoleInfo('GenericShowPage internalUpdateData data : ', data);
    return data
  }

  const internalDeleteData = async(id: string | number) : Promise<T> => {
    const response  = await apiFetch(`${apiUrl}/${id}`, {
      method: "DELETE",
      //headers: {'Content-Type': 'application/json' },
      //credentials: 'include',
      body: JSON.stringify({
        id,
      }),
    });

    const data : T = await getResponseData(response, 'GenericShowPage internalDeleteData')
    //consoleInfo('GenericShowPage internalDeleteData data : ', data);
    return data
  }

  const loadData = async () => {
    try {
      setLocalLoading(true);
      const data = fetchData ? await fetchData(entityId) : await internalFetchData(entityId);
      if (data) {
        const trimmedData = trimStrings(data)
        setEntity(trimmedData);
        setEditedEntity(trimmedData);
        //consoleInfo('loadData trimmedData: ', trimmedData)
        if (user) {
          saveLastViewedId(user.id, tableName, getId(trimmedData));
        }
      }
      else {
        handleError('Not found', '', addNotification)
      }
    }
    catch (err: any) {
      handleError('Failed to load', err, addNotification)
    }
    finally {
      setLocalLoading(false);
    }
  };

  const handleUpdateClick = () => {
    setMode("Edit");
    setRemoteMode("Edit");
  }

  const handleCancelClick = () => {
    //consoleInfo('handleCancelClick mode==="Create": ', mode==="Create")
    //consoleInfo('handleCancelClick entity: ', entity)
    if (mode==="Create") {
      if (getId(entity)===0 || getId(entity)==='') {
        router.back();
      }
    }
    setEditedEntity(entity); 
    setMode("Browse");
    setRemoteMode("Browse");
  };

  const handleRefreshClick = async() => {
    await loadData()
  }

  const handleNewClick = () => {
    const entity = getNewEntity()
    setEditedEntity(entity);
    setMode("Create")
    setRemoteMode("Create");
  }

  const handleDuplicateClick = () => {
    const dupEntity : T = getDuplicateEntity();
    setEditedEntity(dupEntity)
    setMode("Create");
    setRemoteMode("Create");
  }

  const handleSaveClick = async () => {
    if (! getEditedEntity()) return;

    const validationResult = validate(getEditedEntity());
    //consoleInfo('GenericShowPage handleSaveClick validationResult: ', validationResult)
    if (validationResult !== true) {
      handleError('Validation error', '', addNotification)
      return;
    }

    setIsSaving(true);
    const convertedEntity=emptyStringsToNull(serializeDates(getEditedEntity()))
    try {
      if (mode==="Create") {
        const newEntity = createData ? await createData(convertedEntity) : await internalCreateData(convertedEntity);
        addNotification("Entity created", "success");

        const newId = getId(newEntity)        
        const newPath = pathname.replace('/null', `/${newId}`);
        router.replace(newPath);
      } 
      else if (entityId) {
        const updatedEntity = updateData ? await updateData(entity, convertedEntity) : await internalUpdateData(entity, convertedEntity);
        setEntity(updatedEntity);
        setEditedEntity(updatedEntity);
        setMode("Browse");
        setRemoteMode("Browse");
        addNotification("Entity updated", "success");
      }
    }
    catch (err: any) {
      handleError('Save failed', err, addNotification)
    } 
    finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => setDeleteConfirmOpen(true);

  const handleConfirmDelete = async () => {
    if (!entityId || !entity) return;
    try {
      deleteData ? await deleteData(entityId) : await internalDeleteData(entityId);
      addNotification("Entity deleted", "success");
      router.back();
      childUrl && router.back()
    } 
    catch (err: any) {
      handleError('Entity delete failed', err, addNotification)
    }
    finally {
      setDeleteConfirmOpen(false);
    }
  };

  const handleDefaultPrint = async () => {
    if (!entity) {
      return
    };
    try {
      if (onPrint) {
          await onPrint(entity);
          return;
      }

      const title = getDisplayName(entity);
      const doc = (
          <ReportLayout title={title} userId={user?.id}>
            <ReportDetail columns={columns} data={entity} />
          </ReportLayout>
      );

      await downloadPdf(doc, `${title}-detail.pdf`);
    }
    catch (err: any) {
      handleError('Failed to print', err, addNotification)
    }
  };

  useEffect(() => {
    setRemoteMode(startMode)
  }, []);

  useEffect(() => {
    if (mode==="Create") {
      if (!canAdd) {
        handleError("You don't have permission to create a new record.", '', addNotification)
      }
      else {
        const newEntity = getNewEntity();
        setEntity(newEntity);
        setEditedEntity(newEntity);
      }
    }
    else {
      loadData();
    }
  }, []);

  if (status === "loading" || authLoading) return <Loading />;
  if (!session || !user) return null;
  if (!authorized) return null;

  return (
    <>
      <TitleCard title={getDisplayName(entity)}>
        <LoadingBar loading={localLoading || (loading ?? false)} />
        <ToolBarEdit
          isEditing={mode!=="Browse"}
          isSaving={isSaving}
          tableName={tableName}
          onRefresh={handleRefreshClick}
          onNew={canAdd ? handleNewClick : undefined}
          onDuplicate={canAdd ? handleDuplicateClick : undefined}
          onUpdate={mode==="Browse" && canUpdate ? handleUpdateClick : undefined}
          onDelete={mode==="Browse" && canDelete ? handleDeleteClick : undefined}
          onSave={mode!=="Browse" ? handleSaveClick : undefined}
          onCancel={handleCancelClick}
          onPrint={mode==="Browse" && canPrint ? handleDefaultPrint : undefined}
          optionsMenu={optionsMenu}
        />

        {children}
      </TitleCard>

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        description="Confirmer la suppression description"
      />
    </>
  );
}