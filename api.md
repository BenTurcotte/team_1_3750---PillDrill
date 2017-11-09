# General Info
This file describes all of the public endpoints that can be accessed for this project's backend.
These are called APIs, and come in the form of HTTP requests.

Every API will be:
- Using HTTPS (we never want to send unencrypted, possibly sensitive information)
- Use address 131.104.180.41
- Use port 8000
- Using JSON for requests and responses
- Responding with a JSON object, which at the bare minumum will look like 
`{ "error": <error string or null> : String }`

Example API endpoint:
```
GET /apiEndpoint

Request
{}

Response
{
    "error": <error_string or null> : String
}

This means to send a GET request to our server at https://131.104.180.41:8000/apiEndpoint.
Your request's body must match the JSON that is under the header "Request" or else you will
get a 400 status code.
In the response's body, you can tell that it's an error if "error" is not null. Only if it's not null
can you expect to see any other data in the response body.

A colon after a parameter is telling you the expected type of that parameter.

If a GET request has parameters, the definition will look like /thingWithParameter/{param1 : Int},
where you replace param1 with an integer or whichever type is needed.
Calling that endpoint might look like https://131.104.180.41:8000/thingWithParameter/22.
```

# API Endpoints
## POST /users/createAccount
### Request
```json
{
    "email": <their email to use to login> : String,
    "password": <their password to use to login> : String,
    "accountType": <the type of account to create> : String
}
```

### Response
```json
{
    "error": <error string or null> : String
}
```

## POST /users/login
### Request
```json
{
    "email": <email to attempt login> : String,
    "password": <password to attempt login> : String
}
```

### Response
```json
{
    "error": <error string or null> : String,
    "id": <user id> : Number,
    "loginToken": <the token that can be used to verify correct login> : String,
    "loginTokenExpires": <when then loginToken will expire> : String,
    "accountType": <the type of the account that just logged in> : String
}
```
