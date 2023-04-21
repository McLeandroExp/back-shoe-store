import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Usuario from "../models/usuario";
import { generarJWT, googleVerify } from "../helpers";
import { CustomRequest } from "../interfaces";
const loginController = async (req: Request, res: Response) => {
  const { correo, password } = req.body;
  try {
    //verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: `No existe el usuario ${correo}`,
        ok: false,
        usuario: null,
        token: null,
      });
    }
    //si el usuario esta activo en bdd
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario no existe -estado:false",
        ok: false,
        usuario: null,
        token: null,
      });
    }

    //verificar la contrasenia
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / password no son correctos",
        ok: false,
        usuario: null,
        token: null,
      });
    }
    //generar jwt
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
      ok: true,
      msg: "Usuario logeado correctamente",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "algo salio mal :(", ok: false });
  }
};
const userSignIn = async (req: Request, res: Response) => {
  const { nombre, correo, password } = req.body;

  try {
    const usuario = new Usuario({ nombre, correo, password, rol: "USER_ROLE" });

    //encriptar la contrasenia
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    //guardar en db
    await usuario.save();
    //generar jwt
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      msg: "Usuario creado y logeado correctamente",
      body: {
        usuario,
        token,
      },
      errors: null,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: "algo salio mal :(", body: null, errors: error });
  }
};

const googleSignIn = async (req: Request, res: Response) => {
  const { id_token } = req.body;

  try {
    const resp = await googleVerify(id_token);

    if (resp) {
      const { nombre, img, correo } = resp;
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
    }
  } catch (error) {
    console.warn(error);
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};

const revalidarToken = async (req: CustomRequest, res: Response) => {
  const { uid } = req;
  const token = await generarJWT(uid);
  res.json({
    ok: true,
    uid,
    token,
  });
};
export { loginController, googleSignIn, userSignIn, revalidarToken };
