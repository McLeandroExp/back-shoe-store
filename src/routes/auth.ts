import { Router } from "express";
import { check } from "express-validator";
import { loginController, googleSignIn } from "../controllers";
import { validarCampos } from "../middlewares/validar-campos";
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
  "/google",
  [check("id_token", "id_token es necesario").not().isEmpty(), validarCampos],
  googleSignIn
);
export { authRouter };
