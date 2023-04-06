import { Router } from "express";
import { buscar } from "../controllers";

const buscarRouter = Router();

buscarRouter.get("/:coleccion/:termino", buscar);

export { buscarRouter };
