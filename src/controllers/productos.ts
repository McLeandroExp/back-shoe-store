import { Response, Request } from "express";
import { CustomRequest } from "../interfaces/custom-request";
import Producto from "../models/producto";
import { IProducto } from "../interfaces";
import Categoria from "../models/categoria";

const obtenerProductos = async (req: CustomRequest, res: Response) => {
  let { limite = 10, desde = 1 } = req.query;
  limite = Number(limite);
  desde = Number(desde);
  const query = { estado: true };
  if (limite && desde && desde >= 1) {
    desde -= 1;
    const [totalBDD, productos] = await Promise.all([
      await Producto.countDocuments(query),
      await Producto.find(query)
        // .populate("usuario", "nombre")
        .populate("categoria", "nombre")
        .skip(desde)
        .limit(limite),
    ]);
    res.json({ totalBDD, totalPeticion: limite, productos });
  } else {
    res.status(400).json({ msg: "Hubo un error en la peticion" });
  }
};

const obtenerProducto = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json({ ok: true, producto });
};

const obtenerProductosPorCategoria = async (req: Request, res: Response) => {
  const arrCategoriasConProductos = await Categoria.aggregate([
    {
      $lookup: {
        from: "productos",
        localField: "_id",
        foreignField: "categoria",
        as: "productos",
      },
    },
  ]);
  res.json(arrCategoriasConProductos);
};
const obtenerProductosPorSexo = async (req: Request, res: Response) => {
  const { sexo } = req.params;
  try {
    switch (sexo) {
      case "hombre":
        const productosHombres = await Producto.find({
          sexo: { $in: ["hombre", "unisex"] },
        }).populate("categoria", "nombre");
        res.json(productosHombres);
        break;
      case "mujer":
        const productosMujeres = await Producto.find({
          sexo: { $in: ["mujer", "unisex"] },
        });
        res.json(productosMujeres);
        break;
      case "unisex":
        const productosUnisex = await Producto.find({ sexo: "unisex" });
        res.json(productosUnisex);
        break;
      default:
        res.status(400).json({ msg: "Error en la peticion" });
        break;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Something went wrong" });
  }
};

const crearProducto = async (req: CustomRequest, res: Response) => {
  let { estado, usuario, nombre, ...body } = req.body;

  nombre = nombre.toLocaleUpperCase();
  const productoDB = await Producto.findOne({ nombre });
  if (productoDB) {
    return res
      .status(400)
      .json({ ok: false, msg: `El producto ${productoDB.nombre} ya existe` });
  }
  const dataProducto: IProducto = {
    nombre,
    usuario: req.usuario._id,
    img: [],
    ...body,
  };
  const producto = new Producto(dataProducto);
  await producto.save();
  res.status(201).json(producto);
};

//actualizarProducto
const actualizarProducto = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;

  let { estado, usuario, ...data } = req.body;

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
  res.json(producto);
};
//borrarCategoria {estado:false}

const borrarProducto = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(productoBorrado);
};

export {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
  obtenerProductosPorCategoria,
  obtenerProductosPorSexo,
};
