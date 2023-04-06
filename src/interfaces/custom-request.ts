import { Request } from "express";

interface CustomRequest extends Request {
  uid?: string;
  usuario?: any;
}
export { CustomRequest };
