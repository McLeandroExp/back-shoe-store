import path from "path";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import { v2 } from "cloudinary";
// v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
v2.config(process.env.CLOUDINARY_URL!);

import { subirArchivos } from "../helpers";
import Usuario from "../models/usuario";
import Producto from "../models/producto";

const actualizarImagenesProducto = async (req: Request, res: Response) => {
  const maxImgsCapacity = 6;
  const { archivo } = req.files!;
  const { id } = req.params;
  const producto = await Producto.findById(id);
  if (!producto) {
    return res
      .status(400)
      .json({ msg: `NO existe un producto con el id ${id}` });
  }

  if (!Array.isArray(archivo)) {
    if (producto.imgs.length >= maxImgsCapacity) {
      const imgDeleted = producto.imgs.pop();
      const publicId = imgDeleted!.split("/").pop()?.split(".").shift();
      v2.uploader.destroy(publicId!);
    }
    try {
      const { tempFilePath } = archivo;
      const { secure_url } = await v2.uploader.upload(tempFilePath);
      producto.imgs.unshift(secure_url);
      await producto.save();
      res.json(producto);
    } catch (err) {
      res.json(err);
    }
  } else {
    if (archivo.length > maxImgsCapacity) {
      return res
        .status(400)
        .json({ msg: `El numero maximo de imagenes es de ${maxImgsCapacity}` });
    }
    for (const img of archivo) {
      try {
        if (producto.imgs.length >= maxImgsCapacity) {
          const imgRemoved = producto.imgs.pop();
          const publicId = imgRemoved?.split("/").pop()?.split(".").shift();
          await v2.uploader.destroy(publicId!);
        }
        const { tempFilePath } = img;
        const { secure_url } = await v2.uploader.upload(tempFilePath);
        producto.imgs.unshift(secure_url);
        await producto.save();
      } catch (err) {
        console.error(err);
      }
    }
    res.json(producto);
  }
};

const actualizarImagenUsuarioCloudinary = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const usuario = await Usuario.findById(id);
  if (!usuario) {
    return res
      .status(400)
      .json({ msg: `NO existe un usuario con el id ${id}` });
  }

  //limpiar imagenes previas
  if (usuario.img) {
    const publicId = usuario.img.split("/").pop()?.split(".").shift();
    v2.uploader.destroy(publicId!);
  }
  if (!Array.isArray(req.files!.archivo)) {
    try {
      const { tempFilePath } = req.files!.archivo;
      const { secure_url } = await v2.uploader.upload(tempFilePath);
      usuario.img = secure_url;
      await usuario.save();
      res.json(usuario);
    } catch (err) {
      res.json(err);
    }
  }
};

const mostrarImagenUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;

  const usuario = await Usuario.findById(id);
  if (!usuario) {
    return res
      .status(400)
      .json({ msg: `NO existe un usuario con el id ${id}` });
  }
  if (usuario.img) {
    //hay que borrar la imagen del servidor
    const pathImagen = path.join(__dirname, "../uploads/usuario", usuario.img);
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }
  const pathNotfound = path.join(__dirname, "../assets/no-image.jpg");
  return res.sendFile(pathNotfound);
};
export {
  actualizarImagenesProducto,
  // actualizarImagen,
  mostrarImagenUsuario,
  actualizarImagenUsuarioCloudinary,
};
