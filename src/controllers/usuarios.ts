import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Usuario from "../models/usuario";
import { CustomRequest } from "../interfaces/custom-request";
const usuariosGet = async (req: Request, res: Response) => {
  let { limite = 5, desde = 1 } = req.query;
  limite = Number(limite);
  desde = Number(desde);
  const query = { estado: true };
  if (limite && desde && desde >= 1) {
    desde -= 1;
    const [totalBDD, usuarios] = await Promise.all([
      await Usuario.countDocuments(query),
      await Usuario.find(query).skip(desde).limit(limite),
    ]);
    res.json({ totalBDD, totalPeticion: limite, usuarios });
  } else {
    res.status(400).json({ msg: "Hubo un error en la peticion" });
  }
};
const usuariosPost = async (req: Request, res: Response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //encriptar la contrasenia
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);
  //guardar en db
  await usuario.save();
  res.status(201).json({ msg: "post api", usuario });
};
const usuariosPut = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;
  if (password) {
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }
  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json(usuario);
};
const usuariosDelete = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json(usuario);
};
export { usuariosGet, usuariosPost, usuariosPut, usuariosDelete };
