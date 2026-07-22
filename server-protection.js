const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const crypto = require('crypto');

const app = express();

// 1. Security Headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    }
}));

// 2. CORS Protection
app.use(cors({
    origin: 'https://yourdomain.com',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// 4. Content Protection Middleware
app.use((req, res, next) => {
    // Prevent iframe embedding
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
});

// 5. API Key Authentication for sensitive data
const API_KEYS = new Map();
API_KEYS.set('your-api-key', { 
    permissions: ['read:content'],
    expires: Date.now() + 86400000 // 24 hours
});

app.use('/api/protected/*', (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || !API_KEYS.has(apiKey)) {
        return res.status(401).json({ error: 'Invalid API key' });
    }
    next();
});

// 6. Data Encryption endpoint
app.post('/api/encrypt', (req, res) => {
    const { data, key } = req.body;
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    res.json({
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex')
    });
});

// 7. Serve protected content with dynamic loading
app.get('/api/content/:id', (req, res) => {
    const contentId = req.params.id;
    // Fetch content from database
    const content = getContentFromDB(contentId);
    
    // Encrypt response
    const key = process.env.ENCRYPTION_KEY;
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(JSON.stringify(content));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    res.json({
        iv: iv.toString('hex'),
        data: encrypted.toString('hex')
    });
});

module.exports = app;
