import { Router } from "express";
import { check } from "express-validator";

import { tieneRole, validarCampos, validarJWT } from "../middlewares";

import {
  emailExiste,
  esRoleValido,
  existeUsuarioPorId,
} from "../helpers/db-validators";
import {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
} from "../controllers/usuarios";
const userRouter = Router();
userRouter.get("/", usuariosGet);
userRouter.put(
  "/:id",
  [
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);
userRouter.post(
  "/",
  [
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check(
      "password",
      "el password es obligatorio y debe tener mas de 6 letras"
    ).isLength({ min: 6 }),
    // check("rol", "No es un rol valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("correo", "el correo no es valido").isEmail(),
    check("correo", "el correo no debe repetirse").custom(emailExiste),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);
userRouter.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "no es un id valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);
export { userRouter };
