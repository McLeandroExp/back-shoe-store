import { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

const validarCampos = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      body: null,
      ...errors,
      msg: "No se completo la operacion",
    });
  }
  next();
};
export { validarCampos };
