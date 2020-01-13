// =========================================== Importing module for Environment variables ======================================
// console.log(process.env);
// ============================================ Importing express modules ============================================
const express = require('express')
const expressEdge = require('express-edge')
const app = new express()


const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');
app.use(cors({ origin: true }));
var serviceAccount = require('./firebase-config.json');
var firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://war-of-wits.firebaseio.com",
    storageBucket: "war-of-wits.appspot.com"
});
// ============================================ Importing module for defining paths ============================================
const path = require('path')

// ============================================ Importing module to hide/show login, register, logout buttons ==============
const edge = require('edge.js')

// ============================================ Importing module to parse forms ============================================
const bodyParser = require('body-parser')

// ============================================ Importing module for image upload ============================================
const fileUpload = require('express-fileupload')

// ============================================ Importing module for user session ============================================
const expressSession = require('express-session')
const connectFirebase = require('connect-session-firebase');

// ============================================ Importing module for displaying errors for single request ====================
const connectFlash = require('connect-flash')

// ============================================ Importing Controllers ============================================
const homePageController = require('./controllers/homePage')

const createQuizController = require('./controllers/quiz/createQuiz')
const getQuizController = require('./controllers/quiz/getQuiz')
const storeQuizController = require('./controllers/quiz/storeQuiz')

const storeResponseController = require('./controllers/user/storeResponse')

const createUserController = require('./controllers/user/createUser')
const storeUserController = require('./controllers/user/storeUser')

const loginPageController = require('./controllers/user/loginPage')
const loginUserController = require('./controllers/user/loginUser')

const logoutController = require('./controllers/user/logoutUser')

// ============================================ Using Middleware ============================================
app.use(fileUpload())

// Storing session in database
//         secret: functions.config().express.sessionkey,
const FirebaseStore = connectFirebase(expressSession)
app.use(expressSession(
    {
        secret: 'secret',
        name: '__session',
        resave: true,
        saveUninitialized: true,
        store: new FirebaseStore({
            database: firebase.database()
        })
    }
));

app.use(connectFlash())

// app.use(express.static('public'))

app.use(expressEdge.engine)

// For post request - body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const storeQuizMiddleware = require('./middleware/validateQuizData')
const authMiddleware = require('./middleware/auth')
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')

// Sharing session userId globally
app.use('*', (req, res, next) => {
    // Using edge templating engine, the global variable 'auth' is available on 
    // all templates rendered by our templating engine
    edge.global('auth', req.session.userId)
    next()
})

// ============================================ Setting views directory ============================================
app.set('views',`${__dirname}/views`)

// ============================================ Creating actions for requests ============================================
app.get('/', homePageController)

app.get('/quizzes/new', authMiddleware, createQuizController)
app.post('/quizzes/store', authMiddleware, storeQuizMiddleware, storeQuizController)
app.get('/quiz/:id', getQuizController)
app.post('/response/:id', authMiddleware, storeResponseController)

app.get('/auth/register', redirectIfAuthenticated, createUserController)
app.post('/users/register', redirectIfAuthenticated, storeUserController)

app.get('/auth/login', redirectIfAuthenticated, loginPageController)
app.post('/users/login', redirectIfAuthenticated, loginUserController)

app.get('/auth/logout', authMiddleware, logoutController)
// Below command is not able to logout but redirects to main page without logging out WHY?
// app.get('/auth/logout', redirectIfAuthenticated, logoutController)

app.use((req, res) => {
    res.render('not-found')
})

// ============================================ Running application at port 4000 ============================================
// app.listen(process.env.PORT,
//     () => {
//         console.log(`App listening on port ${process.env.PORT}`);
//     }
// )

exports.app = functions.https.onRequest(app);
