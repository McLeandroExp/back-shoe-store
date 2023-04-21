import { Schema, model } from "mongoose";
import { IProducto } from "../interfaces";

const ProductoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: [true, "El estado es obligatorio"],
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: [true, "El usuario es obligatorio"],
  },
  precio: {
    type: Number,
    default: 0,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: [true, "La categoria es obligatoria"],
  },
  descripcion: {
    type: String,
    default: "",
  },
  imgs: [
    {
      type: String,
    },
  ],
  disponible: {
    type: Boolean,
    default: true,
  },
  sexo: {
    type: String,
    enum: ["hombre", "mujer", "unisex"],
    default: "unisex",
  },
  nombre_empresa: {
    type: String,
    default: "sneaker company",
  },
  descuento: {
    type: Number,
    default: 0,
  },
});
ProductoSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();
  return data;
};
export default model<IProducto>("Producto", ProductoSchema);
