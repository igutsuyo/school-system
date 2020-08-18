"use strict";

const express = require("express"),
  layouts = require("express-ejs-layouts"),
  app = express(),
  router = express.Router(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  studentsController = require("./controllers/studentsController.js"),
  usersController = require("./controllers/usersController.js"),
  coursesController = require("./controllers/coursesController.js"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  passport = require("passport"),
  cookieParser = require("cookie-parser"),
  expressSession = require("express-session"),
  expressValidator = require("express-validator"),
  connectFlash = require("connect-flash"),
  User = require("./models/user");

mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/school_system",
    { useNewUrlParser: true, useFindAndModify: false }
);



mongoose.set("useCreateIndex", true);

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

router.use(layouts);
router.use(express.static("public"));
router.use(expressValidator());

router.use(
  express.urlencoded({
    extended: false
  })
);
router.use(express.json());

// cookieParserでの秘密鍵を使う設定
router.use(cookieParser("secretCuisine123"));
//　セクションを使うようにExpress.jsを設定
router.use(
  expressSession({
    secret: "secretCuisine123",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);

router.use(connectFlash());

//passportの初期化、Express.jsの設定
router.use(passport.initialize());
//passportのセクションを使用指示
router.use(passport.session());
//デフォルトのログインストラテジーを設定
passport.use(User.createStrategy());
//passportを、ユーザーデータの圧縮・暗号化/復号を行うように設定
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use((req, res, next) => {
  //possportのログイン状態を示すlogedIn変数を設定
  res.locals.loggedIn = req.isAuthenticated();
  //ログイン中のユーザーを示すcurrentUser変数を設定
  res.locals.currentUser = req.user;
  //リクエストのフラッシュメッセージをレスポンスのローカル変数に代入
  res.locals.flashMessages = req.flash();
  next();
});


router.get("/", homeController.index);
router.get("/chat", homeController.chat);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post(
  "/users/create",
  usersController.validate,
  usersController.create,
  usersController.redirectView
);
router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate);
router.get("/users/logout", usersController.logout, usersController.redirectView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

router.get("/students", studentsController.index, studentsController.indexView);
router.get("/students/new", studentsController.new);
router.post(
  "/students/create",
  studentsController.create,
  studentsController.redirectView
);
router.get("/students/:id/edit", studentsController.edit);
router.put(
  "/students/:id/update",
  studentsController.update,
  studentsController.redirectView
);
router.get("/students/:id", studentsController.show, studentsController.showView);
router.delete(
  "/students/:id/delete",
  studentsController.delete,
  studentsController.redirectView
);

router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);



router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);

const server = app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
}),
io = require("socket.io")(server);
require("./controllers/chatController")(io);