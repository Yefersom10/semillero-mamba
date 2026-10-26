/** Forma mínima de un error de axios/fetch usada para mostrar mensajes al usuario. */
export interface ApiError {
  message?: string;
  response?: {
    status?: number;
    data?: { message?: string | string[]; [key: string]: unknown };
  };
}
