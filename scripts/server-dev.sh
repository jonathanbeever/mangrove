#!/bin/sh

echo "Server starting..."
cd server && nohup npm run docker-dev > api_log.out