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

app.get('/health', async (req, res) => {
   try {
      // Fetch token for IMDSv2
      const tokenResponse = await axios.put('http://169.254.169.254/latest/api/token', null, {
         headers: {
            'X-aws-ec2-metadata-token-ttl-seconds': '21600'
         }
      });
      const token = tokenResponse.data;

      // Fetch Availability Zone
      const azResponse = await axios.get('http://169.254.169.254/latest/meta-data/placement/availability-zone', {
         headers: {
            'X-aws-ec2-metadata-token': token
         },
         timeout: 1000
      });
      const availabilityZone = azResponse.data;

      // Fetch Instance ID
      const instanceIdResponse = await axios.get('http://169.254.169.254/latest/meta-data/instance-id', {
         headers: {
            'X-aws-ec2-metadata-token': token
         },
         timeout: 1000
      });
      const instanceId = instanceIdResponse.data;

      // Fetch Public IP
      const publicIpResponse = await axios.get('http://169.254.169.254/latest/meta-data/public-ipv4', {
         headers: {
            'X-aws-ec2-metadata-token': token
         },
         timeout: 1000
      });
      const publicIp = publicIpResponse.data;

      // Respond with the instance details and availability zone
      res.set('X-Availability-Zone', availabilityZone);
      res.json({ 
         status: 'Healthy', 
         availabilityZone, 
         instanceId, 
         publicIp 
      });

   } catch (error) {
      logger.error('Error fetching instance metadata:', error);
      res.set('X-Availability-Zone', 'Unknown AZ');
      res.status(500).json({ status: 'Error', message: 'Unable to retrieve instance metadata' });
   }
});



app.use('/api', routes);

module.exports = app;