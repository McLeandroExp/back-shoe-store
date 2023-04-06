import { NextFunction, Request, Response } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../interfaces/custom-request";
import Usuario from "../models/usuario";

const validarJWT = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({ msg: "no hay token en la peticion" });
  }
  try {
    const privateKey = process.env.SECRETORPRIVATEKEY;
    jwt.verify(token, privateKey as Secret);
    const { uid } = jwt.decode(token) as JwtPayload;

    req.uid = uid;

    const usuario = await Usuario.findById(uid);
    req.usuario = usuario;

    //que encuentre el usuario
    if (!usuario) {
      return res
        .status(401)
        .json({ msg: "token no valido - usuario no encontrado" });
    }

    //verificar si el uid tiene estado true
    if (!usuario?.estado) {
      return res
        .status(401)
        .json({ msg: "token no valido - usuario con estado false" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: "token no valido" });
  }
};
export { validarJWT };
