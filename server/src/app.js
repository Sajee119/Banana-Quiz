const express = require('express');
const { MongoStore } = require('connect-mongo');
const env = require('./config/env');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Banana Quiz API', endpoints: { auth: '/auth', user: '/api/users', game: '/api/game' } });
});
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;