import Categoria from "../models/categoria";
import Producto from "../models/producto";
import Role from "../models/role";
import Usuario from "../models/usuario";
const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la BDD`);
  }
};
const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El ${correo} ya esta registrado`);
  }
};
const existeUsuarioPorId = async (id = "") => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id ${id} no existe`);
  }
};

const existeCategoriaPorId = async (id = "") => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`El id ${id} no existe`);
  }
};
const existeProductoPorId = async (id = "") => {
  const existeCategoria = await Producto.findById(id);
  if (!existeCategoria) {
    throw new Error(`El id ${id} no existe`);
  }
};

//validar colecciones permitidas
const coleccionesPermitidas = (coleccion = "", colecciones: string[]) => {
  const incluida = colecciones.includes(coleccion);
  if (!incluida) {
    throw new Error(
      `La coleccion ${coleccion} no es permitida, ${colecciones}`
    );
  }
  return true;
};
export {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId,
  coleccionesPermitidas,
};
