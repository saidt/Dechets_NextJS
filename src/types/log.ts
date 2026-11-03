export type LogLevel = "debug" |"info" | "warn" | "error";

export type LogType = {
  id: number,
  date_oper: Date,
  user_id?: string,
  severite: LogLevel
  message: string,
  contexte?: string,
};