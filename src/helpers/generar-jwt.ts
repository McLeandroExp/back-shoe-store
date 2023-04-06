import jwt, { Secret } from "jsonwebtoken";
const generarJWT = (uid = ""): Promise<String | undefined> => {
  return new Promise<String | undefined>((resolve, reject) => {
    const payload = { uid };
    const secret: string | undefined = process.env.SECRETORPRIVATEKEY;
    jwt.sign(
      payload,
      secret as Secret,
      { expiresIn: "4h" },
      (err: Error | null, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};
export { generarJWT };
