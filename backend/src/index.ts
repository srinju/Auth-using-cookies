import express from "express";
import cookieParser from "cookie-parser"; //cookie parser middleware that lets you parse cookies given a cookie
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";
import path from "path"; //library that lets you concatinate paths

const JWT_SECRET = "test123";

//REMEMBER NOTE : COOKIES GO OUT IN EVERY REQUEST THEOUGHT THE USERS SESSION AUTOMATICALLY . we can manually programme it's valid life tho like expires after 24 hours or so .

const app = express();
app.use(cookieParser()); //using the cookie parser as an middleware
app.use(express.json());
app.use(cors({ //in express if we want cookies to set then in cors middleware we have to pass credentials as true and origin as the frontend url which is doing the authentication if we are using a paid service suppose auth.asdasd.com then we will set the origin as that then while signining in it will take us to that particular web page that will let us do the authentication
    credentials: true,
    origin: "http://localhost:5173"
}));

app.post("/signin", (req, res) => { //if we make the api call thriugh postman on localhost:3000/signin whith whatever email and password then we will see that on the response headers there will be a set-cookie header that came back that is nothing but what we intended to do
    const email = req.body.email;
    const password = req.body.password;
    // do db validations, fetch id of user from db
    const token = jwt.sign({
        id: 1
    }, JWT_SECRET);
    res.cookie("token", token); //will put the cookie in the set-cookie header
    res.send("Logged in!");
});

app.get("/user", (req, res) => { //and if we make an api call to this route after signin then we will see that in the response body the user id is 1 is returned so the cookie got verified it made sure it is that user and then told bro your user id is 1
    const token = req.cookies.token; //we are requesting the cookie thanks to the cookie parser lib , we dont have to do the jwt way that is req.headers[AUth]sdasdasd
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    // Get email of the user from the database
    res.send({
        userId: decoded.id
    })
});


app.post("/logout", (req, res) => { //and when we hit this api route via postman then it will just clear the set cookie header that was present basically it will not remove the whole set-cookie fieldbut it does make the set cookie empty it will simply show that the set cookie consisits of token as empty
    res.clearCookie("token");
    res.json({
        message: "Logged out!"
    })
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../src/index.html"))
})

app.listen(3000);