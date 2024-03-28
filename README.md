# Node.js

You have an Express server that has been configured to run at port 5000. When you access the server with /user you can access the endpoints defined in routes/users.js.

Recall that GET, POST, PUT and DELETE are the commonly used HTTP methods to perform CRUD operations. Those operations retrieve and send data to the server.

GET is used to request data from a specified resource.

POST is used to send data to a server for creating a resource.

PUT is used to send data to a server to update a resource.

DELETE is used for deleting a specified resource.

POST AND PUT are sometimes used interchangeably.

This lab requires some packages to be installed. The express and nodemon package for starting and running the Express server and jsonwebtoken and express-session for session based authentication.
express - This is for creating a server to serve the API endpoints.
nodemon - This will help to restart the server when you make any changes to the code.
jsonwebtoken - This package helps in generating a JSON web token which we will use for authentication. A JSON web token (JWT) is a JSON object used to communicate information securely over the internet (between two parties). It can be used for information exchange and is typically used for authentication systems.
express-session - This package will help us to maintain the authentication for the session.

Observe that the express app uses the middleware express.json() to handle the request as a json object.

```bash
app.use(express.json());
```

Observe that the express app uses routes to handle the endpoints which start with /user. This means that for all the endpoints starting with /user, the server will go and look for an endpoint handler in users.js.

```bash
app.use("/user", routes);
```

The starter code given is a functioning server with dummy return values. Before starting to implement the actual endpoints, run the server.

In the terminal, print the working directory to ensure you are in /home/projects/mxpfu-nodejsLabs.

```bash
pwd
```

Install all the packages that are required for running the server. Copy, paste, and run the following command.

```bash
npm install
```

This will install all the required packages as defined in packages.json.

Start the express server.

```bash
npm start
```

Open a New Terminal from the top menu. Test an endpoint to retrieve these users. This has not yet been implemented to return the users.

```bash
curl localhost:5000/user
```

Navigate to the file named users.js in the routes folder. The endpoints have been defined and space has been provided for you to implement the endpoints.

R in CRUD stands for retrieve. You will first add an API endpoint, using the get method for getting the details of all users. A few users have been added in the starter code.
Copy the code below and paste in users.js inside the { } brackets within the router.get(“/“,(req,res)=>{} method.

```bash
  res.send(users);
```

## implementing Authentication

All these endpoints are accessible by anyone. You will now see how to add authentication to the CRUD operations. This code has been implemented in index_withauth.js.

Observe the following code block in index_withauth.js.

```bash
app.use(session({secret:"fingerprint",resave: true, saveUninitialized: true}))
```

This tells your express app to use the session middleware.

secret - a random unique string key used to authenticate a session.
resave - takes a Boolean value. It enables the session to be stored back to the session store, even if the session was never modified during the request.
saveUninitialized - this allows any uninitialized session to be sent to the store. When a session is created but not modified, it is referred to as uninitialized.
The default value of both resave and saveUninitialized is true, but the default is deprecated. So, set the appropriate value according to the use case.

Observe the implementation of the login endpoint. A user logs into the system providing a username. An access token that is valid for one hour is generated. You may observe this validty length specified by 60 * 60, which signifies the time in seconds. This access token is set into the session object to ensure that only authenticated users can access the endpoints for that length of time.

```bash

app.post("/login", (req,res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({message: "Body Empty"});
    }
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});
```

Observe the implementation of the authentication middleware. All the endpoints starting with /user will go through this middleware. It will retrieve the authorization details from the session and verify it. If the token is validated, the user is authenticated and the control is passed on to the next endpoint handler. If the token is invalid, the user is not authenticated and an error message is returned.

```bash
app.use("/user", (req,res,next)=>{
// Middleware which tells that the user is authenticated or not
   if(req.session.authorization) {
       let token = req.session.authorization['accessToken']; // Access Token
       jwt.verify(token, "access",(err,user)=>{
           if(!err){
               req.user = user;
               next();
           }
           else{
               return res.status(403).json({message: "User not authenticated"})
           }
        });
    } else {
        return res.status(403).json({message: "User not logged in"})
    }
});
```
