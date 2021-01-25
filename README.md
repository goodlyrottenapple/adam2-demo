# duc-demo


To run on a server, you will need docker. First, add a `.env.production` file to `frontend/`, replacing `<url_of_server>` with the URL the server will be hosted at:

```
REACT_APP_API_URL=http://<url_of_server>
```

Then do

```docker build --tag duc-demo .```

and launch via

```docker run -p 80:80 -d --restart unless-stopped duc-demo```
