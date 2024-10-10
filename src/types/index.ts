import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?:
    | string
    | object
    | {
        id: 1;
        phoneNumber: "09162630612";
        role: "ADMIN";
        iat?: 1728562028;
        exp?: 1728565628;
      };
}
