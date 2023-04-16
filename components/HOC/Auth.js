import cookies from "next-cookies";
import jwt from "jsonwebtoken";
const withAuth = (gssp) => {
  return async (ctx) => {
    const { token } = cookies(ctx);
    const redirect = {
      destination: "/auth/login",
      statusCode: 302,
    };
    if (!token) {
      return {
        redirect,
      };
    }
    try {
      jwt.verify(token, process.env.SECRET_KEY);
      return await gssp(ctx);
    } catch (err) {
      return { redirect };
    }
  };
};

const withoutAuth = (gssp) => {
  return async (ctx) => {
    const { token } = cookies(ctx);
    if (token) {
      try {
        jwt.verify(token, process.env.SECRET_KEY);
        return {
          redirect: {
            destination: "/admin",
            statusCode: 302,
          },
        };
      } catch (err) {
        console.log("wrong token");
      }
    }
    return await gssp(ctx);
  };
};

export { withAuth, withoutAuth };
