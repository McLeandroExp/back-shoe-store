import { Schema, model } from "mongoose";

const RoleSChema = new Schema({
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
  },
});
export default model("Role", RoleSChema);
