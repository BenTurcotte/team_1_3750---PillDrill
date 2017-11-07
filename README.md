# 3750
System Analysis and Design in Applications

Tamara Charchoghlyan

Benjamin Cecile

Ben Turcotte

Bi Zhao

# Brief Overview
The server is written in JavaScript, using Node.js to run it on a server.
To ease the creation of the API endpoints that the front-ends will be talking to, Express.js is
used. It is a framework for creating HTTP paths or routes that something can get to.
```
For example, if our server is hosted and running on http://example.com/thing, /thing is the path,
similar to how a filesystem works.
```
Our database is Sqlite which is a simple SQL database that can only be accessed locally. There is
a Node.js library called Sqlite3 which we can use to manage our database.

# Production Server Info
IP Address: 131.104.180.41

User: sysadmin

Password: SnowyWinterIsComing

In a Bash terminal, enter `ssh sysadmin@131.104.180.41` and then enter the password.

# Documentation
Here are some links to documentation:
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Sqlite3](https://www.sqlite.org/docs.html)
- [Sqlite3 API](https://github.com/mapbox/node-sqlite3/wiki/API)
- [Express.js](https://expressjs.com/en/4x/api.html)
- [Node.js](https://nodejs.org/api)
