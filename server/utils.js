import jwt from "jsonwebtoken";

export const generateUserToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      address: user.address,
      birthdate: user.birthdate,
      is_stockist: user.is_stockist,
      is_admin: user.is_admin,
      is_ancestor: user.is_ancestor,
    },
    process.env.JWT_SECRET || "somethingsecret",
    {
      expiresIn: "30d",
    }
  );
};

export const verifyUserToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX

    jwt.verify(
      token,
      process.env.JWT_SECRET || "somethingsecret",
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: "Invalid Token" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

export const checkIfAdmin = (req, res, next) => {
  if (req.user.is_admin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
};