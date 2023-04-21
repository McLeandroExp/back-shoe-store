import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos";
import {
  // actualizarImagen,
  actualizarImagenUsuarioCloudinary,
  actualizarImagenesProducto,
  mostrarImagenUsuario,
} from "../controllers/uploads";
import { coleccionesPermitidas } from "../helpers";
import { validarArchivoSubir } from "../middlewares";
const uploadRouter = Router();

uploadRouter.put(
  "/usuario/:id",
  [
    validarArchivoSubir,
    check("id", "El id debe ser  de mongo").isMongoId(),
    validarCampos,
  ],
  actualizarImagenUsuarioCloudinary
);

uploadRouter.get(
  "/usuario/:id",
  [check("id", "El id debe ser  de mongo").isMongoId(), validarCampos],
  mostrarImagenUsuario,
  validarCampos
);

uploadRouter.put(
  "/producto/:id",
  [
    check("id", "El id debe ser  de mongo").isMongoId(),
    validarArchivoSubir,
    validarCampos,
  ],
  actualizarImagenesProducto
);
export { uploadRouter };
