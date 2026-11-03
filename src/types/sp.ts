export type Stored_Proc_Param_Meta_Type = {
  name: string;
  data_type: string;
  id: number;
};

export type Stored_Proc_Param_Type = {
  name: string;
  value: any;
};

export type Scalar_Function_Param_Type = Stored_Proc_Param_Type;
