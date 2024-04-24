const passport = require('passport');
const createUserDto = require('../dto/userDto');

exports.registrationInstructions = (req, res) => {
    const registrationInstructions = {
        Status: "Not logged in...",
        steps: [
            "Open Postman or your preferred HTTP client.",
            "Set the request method to POST.",
            "Set the request URL to the endpoint for registration. For example, 'http://localhost:8080/api/sessions/register' if you are running your server locally.",
            "Go to the 'Headers' tab and add a header with key 'Content-Type' and value 'application/json'.",
            "Go to the 'Body' tab, select 'raw', and then select 'JSON' from the dropdown menu.",
            "Enter your registration details in JSON format. For example: {\"first_name\": \"John\", \"last_name\": \"Doe\", \"email\": \"johndoe@example.com\", \"age\": 30, \"password\": \"your_password\"}.",
            "Send the request.",
            "If the registration is successful, you should be redirected to the login page or receive a success message. You can now log in with the credentials you registered."
        ],
        note: "Replace the example details with your actual registration information."
    };

    res.json(registrationInstructions);
};

exports.register = (req, res, next) => {
    passport.authenticate('register', async (err, user, info) => {

        if (err) { return next(err); }

        if (!user) {
            req.flash('error', 'Falló el registro.');
            return res.redirect('/register');
        }

        req.logIn(user, async (err) => {
            if (err) { return next(err); }

            req.flash('success', `¡Registro exitoso para ${user.email}!`);
            res.redirect('/login');
        });
    })(req, res, next);
};

exports.loginInstructions = (req, res) => {
    const loginInstructions = {
        Status: "Not logged in...",
        steps: [
            "Open Postman or your preferred HTTP client.",
            "Set the request method to POST.",
            "Set the request URL to the endpoint for logging in. For example, 'http://localhost:8080/api/sessions/login' if you are running your server locally.",
            "Go to the 'Headers' tab and add a header with key 'Content-Type' and value 'application/json'.",
            "Go to the 'Body' tab, select 'raw', and then select 'JSON' from the dropdown menu.",
            "Enter your login credentials in JSON format. Example: {\"email\": \"your_email@example.com\", \"password\": \"your_password\"}.",
            "Send the request.",
            "If login is successful, you should receive a response including a session cookie. Use this cookie for subsequent requests to authenticated routes."
        ],
        note: "If not registered visit 'http://localhost:8080/api/sessions/register'"
    };

    res.json(loginInstructions);
};

exports.login = (req, res, next) => {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const user = {
            email,
            first_name: 'Admin',
            last_name: 'CoderHouse',
            age: '9999',
            role: 'admin'
        };    
        req.session.user = user;    
        const userName = `${user.first_name} ${user.last_name}`;
        console.log(`Inicio de sesión local para usuario: ${userName}`);
        req.flash('success', `¡Inicio de sesión exitoso para: ${userName}!`);
        return res.redirect('/products');
    }    

    passport.authenticate('login', (err, user, info) => {
        if (err) {
            console.log('Error al iniciar sesión:', err);
            req.flash('error', 'Error al iniciar sesión...');
            return next(err);
        }
        if (!user) {
            console.log('Intento de inicio de sesión fallido para:', email);
            req.flash('error', 'Usuario o contraseña incorrectos...');
            return res.redirect('/login'); 
        }
        req.logIn(user, (err) => {
            if (err) {
                console.log('Error al iniciar sesión:', err);
                req.flash('error', 'Error al iniciar sesión...');
                return next(err);
            }
            req.session.user = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role
            };
            const userName = `${user.first_name} ${user.last_name}`;
            console.log(`Inicio de sesión local para usuario: ${userName}`);
            req.flash('success', `¡Inicio de sesión exitoso para: ${userName}!`);
            return res.redirect('/products');
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    const userName = req.user ? `${req.user.first_name} ${req.user.last_name}` : 'Desconocido';

    req.logout(function(err) {
        if (err) {
            console.log('Error al cerrar sesión:', err);
            req.flash('error', 'Error al cerrar sesión...');
            return res.redirect('/profile');
        }

        req.session.destroy((err) => {
            if (err) {
                console.log('Error al destruir la sesión:', err);
                req.flash('error', 'Error al destruir sesión...');
                return res.redirect('/profile');
            }            
            res.clearCookie('connect.sid', { path: '/' });
            console.log(`Cierre de sesión exitoso para el usuario: ${userName}`);            
            res.redirect('/login');
        });
    });
};

exports.githubAuth = passport.authenticate("github", { scope: ["user:email"] });

exports.githubCallback = (req, res, next) => {
    passport.authenticate("github", { failureRedirect: "/login" }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            
            const userName = user ? `${user.first_name} ${user.last_name}` : 'Desconocido';
            
            req.session.user = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: 'GitHub ID: ' + user.email,
                age: user.age,
                role: user.role
            };
            req.session.login = true;
            
            console.log(`Inicio de sesión desde GitHub para usuario: ${userName}`);
            req.flash('success', `¡Inicio de sesión con GitHub exitoso para: ${userName}!`);
            res.redirect("/products");
        });
    })(req, res, next);
};

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = (req, res, next) => {
    passport.authenticate("google", { failureRedirect: "/login" }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            const userName = user ? `${user.first_name} ${user.last_name}` : 'Desconocido';
            
            req.session.user = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: 'Google ID: ' + user.email,
                age: user.age,
                role: user.role
            };
            req.session.login = true;

            console.log(`Inicio de sesión desde Google para usuario: ${userName}`);
            req.flash('success', `¡Inicio de sesión con Google exitoso para: ${userName}!`);
            res.redirect("/products");
        });
    })(req, res, next);
};

exports.currentSession = (req, res) => {
    if (req.user) {
        const userDto = createUserDto(req.user);

        res.json({
            success: true,
            user: userDto
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'No hay un usuario logueado.'
        });
    }
};