const jwt = require("jsonwebtoken");

const isAuth = (req) => {
    const authorization = req.headers["authorization"];
    if (!authorization) throw new Error("You need to log in")
    // Based on 'Bearer ksfljrewori384328289398432'
    const token = authorization.split(" ")[1];
    const { userId } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return userId;
};

module.exports = {
    isAuth,
}