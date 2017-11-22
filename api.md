# Announcement!
Please note the naming conventions used for every element name of a json object.  Every name uses an underbar (_) between words.
```
eg. old name: loginToken
    new name: login_token
```
There were some inconsistencies between api & db variable names being passed back and fourth. Any json object that could be passed to the front end at some point will follow the naming convention above.

---

# General Info ![alt text](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Info_Simple_bw.svg/1024px-Info_Simple_bw.svg.png "info")
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
where you replace param1 with an Number or whichever type is needed.
Calling that endpoint might look like https://131.104.180.41:8000/thingWithParameter/22.
```

---
# API Endpoints

## POST /users/createAccount
### Request
```javascript
{
    "login_token" : String,
    "creator_id" : Number,
    "new_user" : {
        "first_name"	      : String,
	"last_name"	      : String,
        "email"               : String,
        "password"            : String,
	"phone_num"	      : String,
        "account_type"        : String
    }
}
```

### Response
```javascript
{
    "error" : String  // error string or null
}
```


---
## POST /users/login
### Request
```javascript
{
    "email"    : String,  // email to attempt login
    "password" : String   // password to attempt login
}
```

### Response
```javascript
{
    "error"               : String,  // error string or null>
    "user_id"             : Number,  // user id
    "login_token"         : String,  // the token that can be used to verify correct login
    "login_token_expires" : String,  // format: YYYYMMDDHHmm // when then login_token will expire
    "account_type"        : String   // the type of the account that just logged in
}
```


---
## POST /medication/getMedications
### Request
```javascript
{
    "user_id"     : String,  // user's id
    "login_token" : String   // login token retrieved during login
}
```

### Response
```javascript
[
    {
        "med_id"              : String,  // medication id
        "user_id"             : String,  // user id
        "name"                : String,  // name of medication
        "dosage"              : Number,  // 
        "dosage_unit"         : String,  // 
        "start_date"          : String,  // format: YYYYMMDD
        "end_date"            : String,  // format: YYYYMMDD
        "time"                : String,  // format: HHmm
        "days_of_week"        : String,  // 
        "notes"               : String,  // 
        "notification"        : Number,  // on\off
        "notification_before" : Number,  //
        "hits"                : Number,  // count of times user HAS taken this med
        "misses"              : Number   // count of times user HAS NOT taken this med
    },
    {
        // next medication
    },
    {
        // another medication
    }
]

```


---
## POST /medication/getSchedule
### Request
```javascript
{
    "user_id"    : String,  // user's id
    "login_token" : String   // login token retrieved during login
}
```

### Response
```javascript
// 7 element array, one for each day
// each day contains a list of meds to be taken that day
// meds are sorted by time
// each med is an abbreviated version of a full medication record
[
    // Sunday
    [
        {
            "med_id"       : String,  // medication id
            "user_id"      : String,  // user id
            "name"         : String,  // 
            "dosage"       : Number,  // 
            "dosage_unit"  : String,  // 
            "time"         : String,  // 24 hour time, format --> HHmm
            "notes"        : String,  // 
            "notification" : Number   // Number used as on/off for notifications
        },
        {
            // next medication
        },
        {
            // etc.
        }
    ],
    
    // Monday
    [
        {
            // same format as above
        },
        {
            // etc.
        }
    ],

    // ...
    [
        // ...
    ],

    // Saturday
    [
        // ...
    ]
]
```


---
## POST /medication/updateMedication
### Request
```javascript
{
    "login_token" : String, // login token obtain upon logging in
    "med" :                // medication object
        {
            "med_id"              : String,  // medication id
            "user_id"             : String,  // user id
            "name"                : String,  // name of medication
            "dosage"              : Number,  // 
            "dosage_unit"         : String,  // 
            "start_date"          : String,  // format: YYYYMMDD
            "end_date"            : String,  // format: YYYYMMDD
            "times"               : String,  // comma separated, format: HHmm
            "days_of_week"        : String,  // comma separated, each item b'n commas is either 1 or 0
            "notes"               : String,  // 
            "notification"        : Number,  // on/off 
            "notification_before" : Number,  // 
            "hits"                : Number,  // 
            "misses"              : Number   //
        }
}
```

### Response
```javascript
{
    "msg" : String  // success message
}
```


---
## POST /medication/deleteMedication
### Request
```javascript
{
    "login_token" : String,  // login token obtain upon logging in
    "user_id"    : String,  // user id
    "med_id"     : String   // medication id
}
```

### Response
```javascript
{
    "msg" : String  // success message
}
```

![alt text](https://thei535project.files.wordpress.com/2016/01/2e06a4dbad3e80ac82a8fd771fe3f6c4.jpg?w=240 "happy minion")
