import { Schema, model } from "mongoose";
import { ICategoria } from "../interfaces";

const CategoriaSchema = new Schema<ICategoria>({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: [true, "El usuario es obligatorio"],
  },
});

CategoriaSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();
  return data;
};

export default model<ICategoria>("Categoria", CategoriaSchema);
