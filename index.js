import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import db from './config/db.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Import routes
import userRoutes from './routes/userRoutes.js';
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
import commercialRoutes from './routes/commercialRoutes.js';
import loanRoutes from './APIController/loanRoutes.js';
import homeInsuranceRoute from './APIController/homeInsuranceRoute.js';
import homeInteriorRoute from './APIController/homeInteriorRoute.js';
import homeShiftRoute from './APIController/homeShiftRoute.js';
import favoritesRoutes from './APIController/favoritesRoutes.js';
import advertisementsRoute from './APIController/advertisementsRoute.js';
import imageuploadcontroller from './APIController/imageuploadcontroller.js';
import awssimageuploadcontroller from './APIController/awssimageuploadcontroller.js';
import ownerPropertyRoutes from './routes/ownerPropertyRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import crmRoutes from './routes/crmRoutes.js';
import leadGenRoutes from './routes/leadGenerationRoutes.js';
import colivingRoutes from './routes/colivingRoutes.js';
import colivingRoomsRoutes from './routes/colivingRoomsRoutes.js';
import rentAgreementRoutes from './routes/rentAgreementRoutes.js';
import verifastRoutes from './routes/verifastRoutes.js';




 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// app.use(cors());
app.use(cors({
  origin: ['http://localhost:5173', 'http://ec2-43-205-18-191.ap-south-1.compute.amazonaws.com','http://townmanor.ai','https://townmanor.ai','http://www.townmanor.ai/','https://www.townmanor.ai/','www.townmanor.ai','townmanor.ai'], // Frontend domains
  credentials: true,   // Allow cookies to be sent
}));

// Handle preflight OPTIONS requests for CORS
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.townmanor.ai');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // To handle URL-encoded data
app.use(express.static('public'));
app.use('/files', express.static(path.join(__dirname, 'files'))); 

app.use(session({
  secret: 'JWT_SECRET',
  resave: false,
  saveUninitialized: true,
}));

// Ensure the uploads folder exists

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
// Use Verifast routes
app.use('/verifast',verifastRoutes);
//ads routs
app.use(adsAgentRoutes)
app.use(userdetailsRoute)
app.use(userPackage)
app.use(userplanslimit)
app.use(advertisementsRoute)
app.use('/api/users', userRoutes);
app.use(propertyLeadRoutes); 
app.use('/api/properties', propertyRoutesroute);
app.use('/api/commercial', commercialRoutes);
app.use('/api', loanRoutes);
app.use('/api', homeInsuranceRoute);
app.use('/api', homeInteriorRoute);
app.use('/api', homeShiftRoute);
app.use('/api', favoritesRoutes);

// Route for owner property APIs
app.use('/owner-property', ownerPropertyRoutes);

// Blog and Article Routes
app.use('/blogs', blogRoutes);
app.use('/articles', articleRoutes);

//crm routes
app.use('/crm', crmRoutes);

//lead generation routes
app.use('/formlead', leadGenRoutes);

//files upload

app.use('/image',imageuploadcontroller);
app.use('/image',awssimageuploadcontroller);



// //colivingRooms

app.use('/coliving', colivingRoutes);

//coliving rooms
app.use('/coliving-rooms', colivingRoomsRoutes);

// Rent Agreement routes
app.use('/rentagreement', rentAgreementRoutes);




// Start server
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
