const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { registrationValidation, loginValidation } = require("../auth/validation");
const { sendAccessToken, sendRefreshToken, createAccessToken, createRefreshToken } = require("../auth/tokens");

//register
const registerUser = async (req, res) => {
    //validation
    const { error } = registrationValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
    } catch (err) {
        res.send({
            error: `${err.message}`,
        });
    }
    //check if user is already existing in db
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send("Email already exists");

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });

    try {
        const savedUser = await user.save();
        res.send({ user: savedUser });
    } catch (err) {
        res.status(400).send(err.message);
    }
};

//login
const loginUser = async (req, res) => {
    //validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        //check if user is already existing in db
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Email or Password is wrong");

        //check if password is correct
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send("Email or Password is wrong");

        //create json web tokens
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);

        //store refreshtoken in database
        user.refreshToken = refreshToken;
        try {
            const savedUser = await user.save();
        } catch (err) {
            res.status(400).send(err);
        }

        //send refreshtoken as a cookie, and accesstoken as regular response
        sendRefreshToken(res, refreshToken);
        sendAccessToken(req, res, accessToken, user);
        // res.status(200).send({ result: user, accessToken });
    } catch (err) {
        res.send({
            error: `${err.message}`,
        });
    }
};

//logout
const logoutUser = (req, res) => {
    res.clearCookie("reft", { path: "/refresh_token" });
    return res.send({
        message: "Logged Out",
    });
};

// 5. Get a new access token with a refresh token
const getRefreshToken = async (req, res) => {
    const token = req;
    console.log("COOKE", token)
    // If we don't have a token in our request
    if (!token) return res.send({ accesstoken: "" });
    // We have a token, let's verify it!
    let payload = null;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return res.send({ accesstoken: "" });
    }
    // token is valid, check if user exist
    const user = await User.find((user) => user._id === payload.userId);
    if (!user) return res.send({ accesstoken: "" });

    // user exist, check if refreshtoken exist on user
    if (user.refreshToken !== token) return res.send({ accesstoken: "" });
    // token exist, create new Refresh- and accesstoken
    const accesstoken = createAccessToken(user.id);
    const refreshtoken = createRefreshToken(user.id);
    // update refreshtoken on user in db
    // Could have different versions instead!
        //store refreshtoken in database
    user.refreshToken = refreshtoken;
    try {
        const savedUser = await user.save();
    } catch (err) {
        res.status(400).send(err);
    }

    // All good to go, send new refreshtoken and accesstoken
    sendRefreshToken(res, refreshtoken);
    return res.send({ accesstoken });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getRefreshToken,
};
