import jwt from "jsonwebtoken";
let protectRoute = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if(!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const userInfo = jwt.verify(token, process.env.JWT_SECRET);

    req.user = userInfo;
    next();

  }catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
export default protectRoute