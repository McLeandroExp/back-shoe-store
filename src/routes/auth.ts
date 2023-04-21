import { Router } from "express";
import { check } from "express-validator";
import {
  loginController,
  googleSignIn,
  userSignIn,
  revalidarToken,
} from "../controllers";
import { validarCampos } from "../middlewares/validar-campos";
import { emailExiste, esRoleValido } from "../helpers";
import { validarJWT } from "../middlewares";
const authRouter = Router();
authRouter.post(
  "/login",
  [
    check("correo", "el correo es obligatorio").isEmail(),
    check("password", "contrasenia  obligatoria").not().isEmpty(),
    validarCampos,
  ],
  loginController
);
authRouter.post(
  "/signIn",
  [
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check(
      "password",
      "el password es obligatorio y debe tener mas de 6 letras"
    ).isLength({ min: 6 }),
    // check("rol", "No es un rol valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("correo", "el correo no es valido").isEmail(),
    check("correo", "el correo no debe repetirse").custom(emailExiste),
    validarCampos,
  ],
  userSignIn
);
authRouter.post(
  "/google",
  [check("id_token", "id_token es necesario").not().isEmpty(), validarCampos],
  googleSignIn
);
authRouter.get("/renew", validarJWT, revalidarToken);
export { authRouter };
