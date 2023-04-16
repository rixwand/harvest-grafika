import jwt from "jsonwebtoken";
export default function authorization(req, res) {
  return new Promise((resolve, reject) => {
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).end();

    const [authType, authToken] = authorization.split(" ");

    if (authType != "Bearer") return res.status(401).end();
    jwt.verify(authToken, process.env.SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).end();
      resolve(decoded);
    });
  });
}
