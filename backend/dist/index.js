"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser")); //cookie parser middleware that lets you parse cookies given a cookie
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const path_1 = __importDefault(require("path")); //library that lets you concatinate paths
const JWT_SECRET = "test123";
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)()); //using the cookie parser as an middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173"
}));
app.post("/signin", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // do db validations, fetch id of user from db
    const token = jsonwebtoken_1.default.sign({
        id: 1
    }, JWT_SECRET);
    res.cookie("token", token); //will put the cookie in the set-cookie header
    res.send("Logged in!");
});
app.get("/user", (req, res) => {
    const token = req.cookies.token; //we are requesting the cookie thanks to the cookie parser lib , we dont have to do the jwt way that is req.headers[AUth]sdasdasd
    const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    // Get email of the user from the database
    res.send({
        userId: decoded.id
    });
});
app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "Logged out!"
    });
});
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../src/index.html"));
});
app.listen(3000);
