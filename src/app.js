const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const sessionsRouter = require('./routes/sessions.router.js');
const initializePassport = require("./config/passport.config.js");
const config = require('./config/config.js');
const UserModel = require('./dao/models/user-mongoose.js');
const errorHandler = require('./middleware/errorHandler.js');
const errorCodes = require('./utils/errorCodes');

const PORT = config.APP_PORT;
require("./database.js");

const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(cookieParser());

const oneWeekLogin = 7 * 24 * 60 * 60;

app.use(session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: config.MONGODB_URI,
        ttl: oneWeekLogin
    }),
    cookie: {
        maxAge: oneWeekLogin * 1000
    }
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(async (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user.toObject();

        res.locals.role = req.user.role;

        const userWithCart = await UserModel.findById(req.user._id).populate('cart');
        if (userWithCart && userWithCart.cart) {
            res.locals.cartId = userWithCart.cart._id;
        }
    }
    if (req.session.user) {
        req.user = req.session.user;
        res.locals.user = req.session.user;
    }
    next();
});

app.use(express.static("./src/public"));

app.engine("handlebars", exphbs.engine({
    helpers: {
        multiply: function (a, b) {
            return (a * b).toFixed(2);
        },
        totalCart: function (products) {
            let total = 0;
            products.forEach(product => {
                total += product.quantity * product.productId.price;
            });
            return total.toFixed(2);
        },
        eq: function (arg1, arg2) {
            return arg1 === arg2;
        }
    }
}));

app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);

app.use('/api/sessions', sessionsRouter);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.code = 'NOT_FOUND';
    error.status = errorCodes.NOT_FOUND.statusCode;
    next(error);
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
//Se borra esto?
const ProductManagerFs = require("./dao/fs/productManager-fs")
const productManagerFs = new ProductManagerFs("./dao/fs/products.json");
//
const ProductRepositor = require("./repository/productRepository.js");
const productRepositor = new ProductRepositor();

const io = socket(server);

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    socket.emit("products", await productRepositor.getProducts());

    socket.on("deleteProduct", async (id) => {
        await productRepositor.deleteProduct(id);
        io.sockets.emit("products", await productRepositor.getProducts());
    });

    socket.on("addProduct", async (producto) => {
        await productRepositor.addProduct(producto);
        io.sockets.emit("products", await productRepositor.getProducts());
    });
});

const Message = require('./dao/models/messages-mongoose.js');

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('user email provided', (email) => {
        console.log(`Correo electrónico recibido: ${email}`);

        Message.find().then(messages => {
            socket.emit('load all messages', messages);
        });
    });

    socket.on('chat message', async (data) => {
        try {
            const message = new Message(data);
            await message.save();
            io.emit('chat message', data);
        } catch (error) {
            console.error('Error guardando el mensaje', error);
        }
    });

});