#!/bin/bash

# echo $PORT
# sed -i 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf

service nginx start
uvicorn app.main:app --uds /var/sockets/uvicorn.sock