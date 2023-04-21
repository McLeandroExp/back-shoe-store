import { Router } from "express";
import { check } from "express-validator";
import {
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obtenerProducto,
  obtenerProductos,
  obtenerProductosPorCategoria,
  obtenerProductosPorSexo,
} from "../controllers";
import { existeCategoriaPorId, existeProductoPorId } from "../helpers";
import { esAdminRole, validarCampos, validarJWT } from "../middlewares";

const productosRouter = Router();

//obtener todos los productos - publico
productosRouter.get("/", obtenerProductos);
productosRouter.get("/categorias", obtenerProductosPorCategoria);
productosRouter.get(
  "/sex/:sexo",
  [check("sexo", "debe mandar un sexo valido").exists(), validarCampos],
  obtenerProductosPorSexo
);

productosRouter.get(
  "/:id",
  [
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);
//crear un producto - privado -cualquier persona con un token valido
productosRouter.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "no es un id valido").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
  ],
  crearProducto
);
//actualizar por id- privado - cualquiera con un token valido
productosRouter.put(
  "/:id",
  [
    validarJWT,
    // check("categoria", "no es un id valido").isMongoId(),
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  actualizarProducto
);
//borrar una categoria - admin
productosRouter.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  borrarProducto
);

export { productosRouter };
