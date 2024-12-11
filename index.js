import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import userRoutes from './routes/userRoutes.js';
import db from './config/db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import agentRoutes from './APIController/agentRoutes.js';
import propertyRoutes from './APIController/propertyRoutes.js';
import oldPropertyroute from './APIController/oldPropertyroute.js';
import payuRoutes from './APIController/payuRoutes.js';
import searchbar from './APIController/searchbar.js';
import adsAgentRoutes from './APIController/adsAgentRoutes.js';
import userdetailsRoute from './APIController/userdetailsRoute.js';
import userPackage from './APIController/userPackage.js';
import userplanslimit from './APIController/userplanslimit.js';
import propertyLeadRoutes from './APIController/propertyLeadRoutes.js';
import propertyRoutesroute from './routes/propertyRoutes.js'


 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// app.use(cors());
app.use(cors({
  origin: ['http://localhost:5173', 'http://ec2-43-205-18-191.ap-south-1.compute.amazonaws.com','http://townmanor.ai','http://www.townmanor.ai'], // Frontend domains
  credentials: true, // Allow sending cookies
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // To handle URL-encoded data
app.use(express.static('public'));

app.use(session({
  secret: 'JWT_SECRET',
  resave: false,
  saveUninitialized: true,
}));

// Ensure the uploads folder exists
import fs from 'fs';
const uploadsDir = path.join(__dirname, 'public/images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Root route for first-time visits
app.get('/', (req, res) => {
  res.send('Backend is up and running!');
});


// Use routes
app.use(agentRoutes);
app.use(propertyRoutes);
app.use(oldPropertyroute);
app.use(searchbar)

// Use PayU routes
app.use(payuRoutes);

//ads routs
app.use(adsAgentRoutes)

app.use(userdetailsRoute)

app.use(userPackage)

app.use(userplanslimit)

app.use('/api/users', userRoutes);

app.use(propertyLeadRoutes); 

app.use('/api/properties', propertyRoutesroute);

// Start server
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
