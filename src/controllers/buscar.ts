import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import Usuario from "../models/usuario";
import Categoria from "../models/categoria";
import Producto from "../models/producto";

const coleccionesPermitidas = ["usuarios", "categoria", "productos", "roles"];

const buscarUsuarios = async (termino = "", res: Response) => {
  const esMongoId = isValidObjectId(termino);
  if (esMongoId) {
    const usuario = await Usuario.findById(termino);
    return res.json({ results: usuario ? [usuario] : [] });
  }

  const regexp = new RegExp(termino, "i");

  const usuarios = await Usuario.find({
    $or: [{ nombre: regexp }, { correo: regexp }],
    $and: [{ estado: true }],
  });
  res.json({ results: usuarios });
};
const buscarCategorias = async (termino = "", res: Response) => {
  const esMongoId = isValidObjectId(termino);
  if (esMongoId) {
    const categoria = await Categoria.findById(termino);
    return res.json({ results: categoria ? [categoria] : [] });
  }

  const regexp = new RegExp(termino, "i");

  const categorias = await Categoria.find({ nombre: regexp, estado: true });
  res.json({ results: categorias });
};
const buscarProductos = async (termino = "", res: Response) => {
  const esMongoId = isValidObjectId(termino);
  if (esMongoId) {
    const producto = await Producto.findById(termino).populate(
      "categoria",
      "nombre"
    );
    return res.json({ results: producto ? [producto] : [] });
  }

  const regexp = new RegExp(termino, "i");

  const productos = await Producto.find({
    nombre: regexp,
    estado: true,
  }).populate("categoria", "nombre");
  res.json({ results: productos });
};

const buscar = (req: Request, res: Response) => {
  const { coleccion, termino } = req.params;
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res
      .status(400)
      .json({ msg: `Las colecciones permitodas son ${coleccionesPermitidas}` });
  }
  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;

    case "categoria":
      buscarCategorias(termino, res);
      break;

    case "productos":
      buscarProductos(termino, res);
      break;
    default:
      res.status(500).json({ msg: "Busqueda no incluida" });
  }
};
export { buscar };
