import mongoose from "mongoose";
import { env } from "process";
const dbConnection = async () => {
  try {
    if (env.MONGODB_CNN) {
      await mongoose.connect(env.MONGODB_CNN);
      console.log("estamos en linea bdd");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error en la coneccion de base de datos");
  }
};

export { dbConnection };
