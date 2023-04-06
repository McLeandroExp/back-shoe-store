import { Router } from "express";
import { check } from "express-validator";
import {
  actualizarCategoria,
  borrarCategoria,
  crearCategoria,
  obtenerCategoria,
  obtenerCategorias,
} from "../controllers";
import { existeCategoriaPorId } from "../helpers";
import { esAdminRole, validarCampos, validarJWT } from "../middlewares";
const categoriasRouter = Router();

//obtener todas las categorias - publico
categoriasRouter.get("/", obtenerCategorias);

//obtener una categoria por id - publico
//middleware personalizado para obtener id
categoriasRouter.get(
  "/:id",
  [
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  obtenerCategoria
);
//crear una categoria - privado -cualquier persona con un token valido
categoriasRouter.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);
//actualizar - privado - cualquiera con un token valido
categoriasRouter.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  actualizarCategoria
);
//borrar una categoria - admin
categoriasRouter.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  borrarCategoria
);

export { categoriasRouter };
