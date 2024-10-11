#!/bin/bash 
# Update package list and install required packages 
sudo yum update -y 
sudo yum install -y git 

# Install Node.js (use NodeSource for the latest version) 
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash - 
sudo yum install -y nodejs 

# Install PM2 globally 
sudo npm install -g pm2 

# Define variables 
REPO_URL="https://github.com/learnItRightWay01/react-node-mysql-app.git" 
BRANCH_NAME="feature/add-logging" 
REPO_DIR="/home/ec2-user/react-node-mysql-app/backend" 
ENV_FILE="$REPO_DIR/.env" 

# Clone the repository 
cd /home/ec2-user 
sudo -u ec2-user git clone $REPO_URL 
cd react-node-mysql-app  

# Checkout to the specific branch 
sudo -u ec2-user git checkout $BRANCH_NAME 
cd backend 

# Define the log directory and ensure it exists 
LOG_DIR="/home/ec2-user/react-node-mysql-app/backend/logs" 
mkdir -p $LOG_DIR 
sudo chown -R ec2-user:ec2-user $LOG_DIR

# Append environment variables to the .env file
echo "LOG_DIR=$LOG_DIR" >> "$ENV_FILE"
echo "DB_HOST=\"anygroupllc-db-instance.cgjrgp3k6yoe.us-east-1.rds.amazonaws.com\"" >> "$ENV_FILE"
echo "DB_PORT=\"3306\"" >> "$ENV_FILE"
echo "DB_USER=\"appuser\"" >> "$ENV_FILE"
echo "DB_PASSWORD=\"learnIT02#\"" >> "$ENV_FILE"  # Replace with actual password
echo "DB_NAME=\"react_node_app\"" >> "$ENV_FILE"

# Install Node.js dependencies as ec2-user
sudo -u ec2-user npm install

# Start the application using PM2 as ec2-user
sudo -u ec2-user npm run serve

# Ensure PM2 restarts on reboot as ec2-user
sudo -u ec2-user pm2 startup systemd 
sudo -u ec2-user pm2 save 

# Install CloudWatch agent
sudo yum install -y amazon-cloudwatch-agent

# Create CloudWatch agent configuration
sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json > /dev/null <<EOL
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/home/ec2-user/react-node-mysql-app/backend/logs/*.log",
            "log_group_name": "backend-node-app-logs",
            "log_stream_name": "{instance_id}",
            "timestamp_format": "%Y-%m-%d %H:%M:%S"
          }
        ]
      }
    }
  }
}
EOL

# Start CloudWatch agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s

