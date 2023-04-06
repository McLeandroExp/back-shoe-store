import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/custom-request";
const esAdminRole = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se quiere verificar el role sin validar el token primero",
    });
  }
  const { rol, nombre } = req.usuario;
  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({ msg: `${nombre} no es administrador` });
  }
  next();
};
const tieneRole = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se quiere verificar el role sin validar el token primero",
      });
    }

    const estaIncluido = roles.includes(req.usuario.rol);
    if (!estaIncluido) {
      res.status(401).json({
        msg: `${req.usuario.nombre} no tiene los permisos para dicha operacion`,
      });
    }
    next();
  };
};
export { esAdminRole, tieneRole };
