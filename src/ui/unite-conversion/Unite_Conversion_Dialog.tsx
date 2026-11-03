"use client";

import MuiDialog from "@/components/ui/dialog/MuiDialog";
import { MuiNumberField, MuiTextField } from "@/components/form-show/Inputs";
import { Box, ButtonProps, DialogProps, Typography } from "@mui/material";
import { ExecuteButton, TipButton } from "@/components/ui/ActionButtons";
import { useState } from "react";
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import { Unite_Type } from "@/types/unite";
import { CmListProps, Filter } from "@/lib/types";
import { getResponseData } from "@/lib/html";
import { ReferenceField } from "@/components/form-show/ReferenceField";
import Unite_List from "../unite/Unite_List";
import { fetchScalarFunction } from "@/lib/fetchData";
import { Scalar_Function_Param_Type } from "@/types/sp";
import { useAppContext } from "@/app/context/AppContext";
import { handleError } from "@/lib/error";
import { LoadingBar } from "@/components/ui/LoadingBar";
import { fetch_Unite } from "@/fetch/unite";

const Unite_Conversion_Dialog = (props: DialogProps) => {
  
  const [uniteSource, setUniteSource] = useState<string>("KM");
  const [uniteDestination, setUniteDestination] = useState<string>("M");
  const [qte, setQte] = useState<number>(1);
  const [result, setResult] = useState<string>("");
  const [unite_forceOpen, set_unite_forceOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const { addNotification } = useAppContext();

  const handleConvert = async () => {
    setLoading(true);
    try {
      const params : Scalar_Function_Param_Type[] = [
        {name: 'UniteSource', value: uniteSource},
        {name: 'UniteDestination', value: uniteDestination},
        {name: 'Qte', value: qte},
      ]          
      const response = await fetchScalarFunction('dbo.d_UniteConvertion', params);
      const result = await response.json();

      if (result.error) {
        addNotification(result.error, "error");
      }
      else {
        setResult(result.data[0].RET_VALUE);
      }
    }
    catch (err) {
      handleError("handleConvert failed", err, addNotification);
    }
    finally {
      setLoading(false);
    }
  };

  const handleInverser = () => {
    const source = uniteSource
    setUniteSource(uniteDestination)
    setUniteDestination(source)
  };

  const check_unite = async(value: string) : Promise<boolean> =>{
    try {
      const response = await fetch_Unite(value)
      const data : Unite_Type = await getResponseData(response, 'Unite_Conversion_Dialog check_unite api error')
      //consoleInfo('Sortie_Dechet_Ligne_Show check_unite data ', data)

      if (! data) {
        return false
      }
      else {
        return true
      }
    }
    catch (err) {
      throw err;
    }
  };

  const handle_Unite_Blur = async(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    //consoleInfo('Sortie_Dechet_Ligne_Show handleBlur unite ', value)
    const ret = await check_unite(value)
    //consoleInfo('Sortie_Dechet_Ligne_Show handle_Unite_Blur ret ', ret)
    set_unite_forceOpen(false)
    if (ret === false) {
      set_unite_forceOpen(true)
    }
  };

  const InverserButton: React.FC<ButtonProps> = (props) => {
    return (
      <TipButton {...props}
        color="warning"  
        startIcon={<MultipleStopIcon />}
        tip="Inverser"
      />
    );
  };

  const unite_source_initialFilter: Filter<Unite_Type> = {
    code: uniteSource
  };

  const Unite_Source_List_Modal = (props: CmListProps<Unite_Type>) => (
    <Unite_List {...props} isModalList={true} initialFilter={unite_source_initialFilter}/>
  )
  
  const unite_destination_initialFilter: Filter<Unite_Type> = {
    code: uniteDestination
  };

  const Unite_Destination_List_Modal = (props: CmListProps<Unite_Type>) => (
    <Unite_List {...props} isModalList={true} initialFilter={unite_destination_initialFilter}/>
  )
  
  const Unite_Conversion_Form = () => (
    <>
      <LoadingBar loading={loading} />
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
        <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
          Quantités
        </Typography>
        <Typography sx={{ fontWeight: "bold", textAlign: "center" }}>
          Unités
        </Typography>

        <MuiNumberField
          label="Convertir"
          value={qte}
          onChange={(e) => setQte(Number(e.target.value))}
          fullWidth
          mode={"Edit"}
        />

        <ReferenceField 
          name="unite_source"
          label="Unité source"
          value={ uniteSource }
          fullWidth
          onChange={(e) => setUniteSource(e.target.value as string)}
          onBlur={handle_Unite_Blur}
          mode={"Edit"}
          onClear={() => setUniteSource('')}  
          fieldName='code'
          setValue={function (value: any): void {
            setUniteSource(value);
          }}
          maxRows="md"
          DataTableComponent={ Unite_Source_List_Modal }
          forceOpen={ unite_forceOpen }
        />

        <MuiTextField
          label="En"
          value={result}
          type="number"
          fullWidth
          mode={"Browse"}
        />

        <ReferenceField 
          name="unite_destination"
          label="Unité destination"
          value={ uniteDestination }
          fullWidth
          onChange={(e) => setUniteDestination(e.target.value as string)}
          onBlur={handle_Unite_Blur}
          mode={"Edit"}
          onClear={() => setUniteDestination('')}
          fieldName='code'
          setValue={function (value: any): void {
            setUniteDestination(value);
          }}
          maxRows="md"
          DataTableComponent={ Unite_Destination_List_Modal }
          forceOpen={ unite_forceOpen }
        />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
        <ExecuteButton onClick={handleConvert}>
          Convertir
        </ExecuteButton>

        <InverserButton onClick={handleInverser}>
          Inverser
        </InverserButton>
      </Box>
    </>
  )

  return (
    <MuiDialog {...props}
      title="Conversion d'unités"
      children={ <Unite_Conversion_Form />}
      maxWidth={"xs"}
    />
  );
};

export default Unite_Conversion_Dialog;