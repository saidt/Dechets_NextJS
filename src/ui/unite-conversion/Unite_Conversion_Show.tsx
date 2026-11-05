"use client";

import {
  Empty_Unite_Conversion,
  UNITE_CONVERSION_FETCH_URL,
  UNITE_CONVERSION_TABLE_NAME,
  unite_Conversion_Schema,
  Unite_Conversion_Type, 
  unite_Conversion_Columns
} from "@/types/unite-conversion";
import { GenericShowPage } from "@/components/form-show/GenericShowPage";
import { CmListProps, Filter, Mode } from "@/lib/types";
import { useState } from "react";
import { MuiNumberField, MuiPKNumberField } from "@/components/form-show/Inputs";
import { ReferenceField } from "@/components/form-show/ReferenceField";
import { useParams, useSearchParams } from "next/navigation";
import { getResponseData } from "@/lib/html";
import { Unite_Type, UNITE_URL } from "@/types/unite";
import Unite_List from "../unite/Unite_List";
import { fetch_Unite } from "@/fetch/unite";
import { useAppContext } from "@/app/context/AppContext";
import { handleError } from "@/lib/error";

// Declared at module level (not inside Unite_Conversion_Show) so each keeps the same
// component identity across re-renders: a component declared inside another
// one is a new type on every render, which remounts it (list reloaded, state
// lost) and, on an API error, re-notifies in an endless loop.
// Per-render values (filters) are passed through ReferenceField dataTableProps.
const Unite_Source_List_Modal = (props: CmListProps<Unite_Type>) => (
  <Unite_List {...props} isModalList={true} />
);

const Unite_Destination_List_Modal = (props: CmListProps<Unite_Type>) => (
  <Unite_List {...props} isModalList={true} />
);

const Unite_Conversion_Show = () => {
  const { addNotification } = useAppContext();


  const { id } = useParams<{ id: string }>();
  //consoleInfo('Unite_Conversion_Show idParam: ', id)
  
  const searchParams = useSearchParams();
  const edit = Boolean(searchParams.get('edit'));
  //consoleInfo('Unite_Conversion_Show edit: ', edit)

  const [unite_Conversion, set_Unite_Conversion] = useState<Unite_Conversion_Type>(Empty_Unite_Conversion);
  const [mode, setMode] = useState<Mode>("Browse"); 
  const [errors, setErrors] = useState<Partial<Record<keyof Unite_Conversion_Type, string>>>({});
  const [unite_source_forceOpen, set_unite_source_forceOpen] = useState<boolean>(false);
  const [unite_destination_forceOpen, set_unite_destination_forceOpen] = useState<boolean>(false);

  function validate(unite_Conversion: Unite_Conversion_Type) : boolean {    
    const result = unite_Conversion_Schema.safeParse(unite_Conversion);
    //consoleInfo('validate result: ', result);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const validationErrors = result.error;
      for (const issue of validationErrors.issues) {
        fieldErrors[issue.path.toString()] = issue.message;
      };
      setErrors(fieldErrors);
      //consoleInfo('Unite_Conversion_Show validate errors : ', JSON.stringify(fieldErrors));
      return false
    }
    setErrors({}); 
    return true
  }

  const get_New_Unite_Conversion = () => {
    const newEntity : Unite_Conversion_Type = Empty_Unite_Conversion
    return newEntity
  }

  const get_Duplicate_Unite_Conversion = () => {
    const { id, ...rest } : Unite_Conversion_Type = unite_Conversion;
    const dupEntity : Unite_Conversion_Type = { id:0, ...rest}
    //consoleInfo('Unite_Conversion_Show getDuplicateUnite_Conversion dupEntity: ', dupEntity)
    return dupEntity
  }
	
	const getModifiedWithId = (unite_Conversion : Unite_Conversion_Type, modifiedUnite_Conversion : Partial<Unite_Conversion_Type>) : Partial<Unite_Conversion_Type> => {
    const modifiedWithId={ id: unite_Conversion.id, ...modifiedUnite_Conversion};
    return modifiedWithId
  }

  function set_Unite_Conversion_Value(name: string, value: any) {
    //consoleInfo('Unite_Conversion_Show set_Unite_Conversion_Value name/value ', name, '/', value)
    set_Unite_Conversion((prevUnite_Conversion) => ({
      ...prevUnite_Conversion,
      [name]: value,
    }));
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    set_Unite_Conversion_Value(name, value);
  };
	
	const check_unite_source = async(value: string) : Promise<boolean> =>{
    try {
      const response = await fetch_Unite(value)
      const data : Unite_Type = await getResponseData(response, 'check_unite_source api error')
      //consoleInfo('Unite_Conversion_Show check_unite_source data ', data)

      if (! data) {
        return false
      }
      else {
        return true
      }
    }
    catch (err) {
      handleError('check_unite_source api error', err, addNotification)
      return false
    }
  };
	
  async function set_Unite_Source(value: string) {
    //consoleInfo('Unite_Conversion_Show set_unite_source value ', value)
    set_Unite_Conversion_Value('unite_source', value);
    const ret = await check_unite_source(value)
    //consoleInfo('Unite_Conversion_Show set_unite_source ret ', ret)
    set_unite_source_forceOpen(false)
    if (ret === false) {
      set_unite_source_forceOpen(true)
    }
  }

  const handle_Unite_Source_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Unite_Conversion_Show handleBlur unite_source ', value)
    const ret = await check_unite_source(value)
    //consoleInfo('Unite_Conversion_Show handle_Unite_Source_Blur ret ', ret)
    set_unite_source_forceOpen(false)
    if (ret === false) {
      set_unite_source_forceOpen(true)
    }
  };

  const unite_source_initialFilter: Filter<Unite_Type> = {
    code: unite_Conversion.unite_source
  };
	
	const check_unite_destination = async(value: string) : Promise<boolean> =>{
    try {
      const response = await fetch_Unite(value)
      const data : Unite_Type = await getResponseData(response, 'check_unite_destination api error')
      //consoleInfo('Unite_Conversion_Show check_unite_destination data ', data)

      if (! data) {
        return false
      }
      else {
        return true
      }
    }
    catch (err) {
      handleError('check_unite_destination api error', err, addNotification)
      return false
    }
  };
	
  async function set_Unite_Destination(value: string) {
    //consoleInfo('Unite_Conversion_Show set_unite_destination value ', value)
    set_Unite_Conversion_Value('unite_destination', value);
    const ret = await check_unite_destination(value)
    //consoleInfo('Unite_Conversion_Show set_unite_destination ret ', ret)
    set_unite_destination_forceOpen(false)
    if (ret === false) {
      set_unite_destination_forceOpen(true)
    }
  }

  const handle_Unite_Destination_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Unite_Conversion_Show handleBlur unite_destination ', value)
    const ret = await check_unite_destination(value)
    //consoleInfo('Unite_Conversion_Show handle_Unite_Destination_Blur ret ', ret)
    set_unite_destination_forceOpen(false)
    if (ret === false) {
      set_unite_destination_forceOpen(true)
    }
  };

  const unite_destination_initialFilter: Filter<Unite_Type> = {
    code: unite_Conversion.unite_destination
  };
	
  return (
    <GenericShowPage<Unite_Conversion_Type>
      tableName={ UNITE_CONVERSION_TABLE_NAME }
      columns={unite_Conversion_Columns}
      apiUrl={ UNITE_CONVERSION_FETCH_URL}
      entityId={id}
      isEditMode={edit}
      setRemoteMode={setMode}
      setEditedEntity={ set_Unite_Conversion }
      getDisplayName={(unite_Conversion: Unite_Conversion_Type) => "Conversion d'unité "+unite_Conversion. id}
      getId={(unite_Conversion: Unite_Conversion_Type) =>  unite_Conversion.id }
      getEditedEntity={() => unite_Conversion }
      getNewEntity={get_New_Unite_Conversion }
      getDuplicateEntity={get_Duplicate_Unite_Conversion }
			getModifiedWithId={getModifiedWithId}
      validate={validate}
      children={
        <>
          <MuiPKNumberField
            name="id"
            label="id"
            value={ unite_Conversion.id }
            fullWidth
            mode={mode}
            error={!!errors.id }
            helperText={errors.id }
            onChange={handleChange}
            onClear={() => set_Unite_Conversion_Value("id", "")} 
          />
          <ReferenceField 
            name="unite_source"
            label="Unité source"
            value={ unite_Conversion.unite_source }
            fullWidth
            onChange={handleChange}
            onBlur={handle_Unite_Source_Blur}
            error={!!errors.unite_source }
            helperText={errors.unite_source }
            mode={mode}
            onClear={() => set_Unite_Conversion_Value('unite_source', '')}  
            fieldName='code'
            setValue={function (value: any): void {
              set_Unite_Source(value);
            }}
            maxRows="md"
            DataTableComponent={ Unite_Source_List_Modal }
            dataTableProps={{ initialFilter: unite_source_initialFilter }}
            followUrl={`${ UNITE_URL}/${ unite_Conversion.unite_source }`}
            forceOpen={ unite_source_forceOpen }
          />
          <ReferenceField 
            name="unite_destination"
            label="Unité destination"
            value={ unite_Conversion.unite_destination }
            fullWidth
            onChange={handleChange}
            onBlur={handle_Unite_Destination_Blur}
            error={!!errors.unite_destination }
            helperText={errors.unite_destination }
            mode={mode}
            onClear={() => set_Unite_Conversion_Value('unite_destination', '')}  
            fieldName='code'
            setValue={function (value: any): void {
              set_Unite_Destination(value);
            }}
            maxRows="md"
            DataTableComponent={ Unite_Destination_List_Modal }
            dataTableProps={{ initialFilter: unite_destination_initialFilter }}
            followUrl={`${ UNITE_URL}/${ unite_Conversion.unite_destination }`}
            forceOpen={ unite_destination_forceOpen }
          />
          <MuiNumberField
            name="coeff"
            label="Coéfficient"
            fractionDigits={2}
            value={ unite_Conversion.coeff }
            fullWidth
            onChange={handleChange}
            error={!!errors.coeff }
            helperText={errors.coeff }
            mode={mode}
            onClear={() => set_Unite_Conversion_Value('coeff', '')}
          />
        </>
      }
    />
  );
};

export default Unite_Conversion_Show;