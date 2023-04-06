import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Usuario from "../models/usuario";
import { generarJWT, googleVerify } from "../helpers";
const loginController = async (req: Request, res: Response) => {
  const { correo, password } = req.body;
  try {
    //verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res
        .status(400)
        .json({ msg: "Usuario / password no son correctos -correo" });
    }
    //si el usuario esta activo en bdd
    if (!usuario.estado) {
      return res
        .status(400)
        .json({ msg: "Usuario / password no son correctos -estado:false" });
    }

    //verificar la contrasenia
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ msg: "Usuario / password no son correctos - password" });
    }
    //generar jwt
    const token = await generarJWT(usuario.id);

    res.json({ usuario, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "algo salio mal :(" });
  }
};

const googleSignIn = async (req: Request, res: Response) => {
  const { id_token } = req.body;

  try {
    const { nombre, img, correo } = await googleVerify(id_token);
    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      const data = {
        nombre,
        correo,
        password: ":x",
        img,
        google: true,
        rol: "USER_ROLE",
      };
      usuario = new Usuario(data);
      await usuario.save();
    }
    //si el usuario en db
    if (!usuario.estado) {
      return res.status(401).json({ ok: false, msg: "Usuario bloqueado" });
    }

    const token = await generarJWT(usuario.id);

    res.json({ ok: true, usuario, token });
  } catch (error) {
    console.warn(error);
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};
export { loginController, googleSignIn };
