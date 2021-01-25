# duc-demo


To run on a server, you will need docker. Then do

```docker build --tag duc-demo .```

and launch via

```docker run -p 80:80 -d --restart unless-stopped duc-demo```
