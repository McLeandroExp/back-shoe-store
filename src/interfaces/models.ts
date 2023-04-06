import { Document, Types } from "mongoose";
interface IUsuario extends Document {
  nombre: string;
  correo: string;
  password: string;
  img?: string;
  rol: string;
  estado?: boolean;
  google?: boolean;
}

interface ICategoria extends Document {
  nombre: string;
  estado?: boolean;
  usuario: Types.ObjectId | IUsuario;
}

interface IProducto extends Document {
  nombre: string;
  estado: boolean;
  usuario: Types.ObjectId | IUsuario;
  precio: number;
  categoria: Types.ObjectId | ICategoria;
  descripcion?: string;
  imgs: string[];
  disponible: boolean;
}
export { IUsuario, ICategoria, IProducto };
