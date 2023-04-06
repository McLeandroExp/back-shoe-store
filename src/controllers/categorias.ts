import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../interfaces/custom-request";
import Categoria from "../models/categoria";

//obtener categorias - paginado - opcional -total -populate:metodo

const obtenerCategorias = async (req: CustomRequest, res: Response) => {
  let { limite = 5, desde = 1 } = req.query;
  limite = Number(limite);
  desde = Number(desde);
  const query = { estado: true };
  if (limite && desde && desde >= 1) {
    desde -= 1;
    const [totalBDD, categorias] = await Promise.all([
      await Categoria.countDocuments(query),
      await Categoria.find(query)
        .populate("usuario", "nombre")
        .skip(desde)
        .limit(limite),
    ]);
    res.json({ totalBDD, totalPeticion: limite, categorias });
  } else {
    res.status(400).json({ msg: "Hubo un error en la peticion" });
  }
};

//obtener categoria  -populate:metodo {}

const obtenerCategoria = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");
  res.json({ ok: true, categoria });
};

const crearCategoria = async (req: CustomRequest, res: Response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res
      .status(400)
      .json({ ok: false, msg: `La categoria ${categoriaDB.nombre} ya existe` });
  }
  //generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };
  const categoria = new Categoria(data);
  await categoria.save();
  res.status(201).json(categoria);
};

//actualizarCategoria
const actualizarCategoria = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
  res.json(categoria);
};
//borrarCategoria {estado:false}

const borrarCategoria = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(categoria);
};
export {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
