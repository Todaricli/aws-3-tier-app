const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const db = require('./configs/db'); // Import the db connection
const logger = require('./utils/logger'); // Import logger
const axios = require('axios'); // Import axios to fetch metadata

const app = express();

app.use(cors());
app.use(bodyParser.json());

db.connect((err) => {
   if (err) {
      logger.error(`Error connecting to MySQL: ${err.stack}`);
      return;
   }

   logger.info('Connected to MySQL Database');
});

/* Add your routes here */
//Health Checking
app.get('/health', async (req,res)=>{
   try {
      // Fetch the availability zone from the EC2 metadata service
      const response = await axios.get('http://169.254.169.254/latest/meta-data/placement/availability-zone', {
         timeout: 1000, // 1 second timeout to ensure it doesn't hang
      });
      const availabilityZone = response.data;

      // Respond with the Availability Zone in a custom header
      res.set('X-Availability-Zone', availabilityZone);
      res.json({ status: 'Healthy', availabilityZone });
   } catch (error) {
      logger.error('Error fetching availability zone:', error);
      res.set('X-Availability-Zone', 'Unknown AZ');
      res.status(500).json({ status: 'Error', message: 'Unable to retrieve availability zone' });
   }
});

app.use('/api', routes);

module.exports = app;