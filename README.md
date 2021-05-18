# ICS-MiniProject

# Authenticity and Security.


This project involves the level-wise authentication from plain text to hash with salting..

- Level I - Password in the form of "Plain Text"
- Level II - Password in the form of "Binary with Secret Key"
- Level III - Password in the form of "Hash"
- Level IV - Password in the form of "Hashing + Salting"
## Features

- Using mongoose-encryption to encrypt the password
- Import md5 and use to encrypt password as hash
- Using bcrypt to use salting with hashing

### Level I
Created a Schema with email and password as feilds.
```
const userSchema = {
    email: String,
    password: String
};
```
and save it .
##### Password Format will be plain text - 123456

### Level II
Using mongoose-encryption technique to secure the password
```
const encrypt = require("mongoose-encryption");
const secret = "Thisisourlittlesecrate";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });
```
##### Password Format will be  - <binary>
Alongwith Using "dotenv" package to stored secret key

### Level III
Using md5 npm package to covert our password to hash
```
const md5 = require("md5");

password: md5(req.body.password)
```
##### Password Format will be:- "e10adc3949ba59abbe56e057f20f883e" refer to the password "123456"

### Level IV
Using bcrypt npm package and salting to overcome the the limitaions of hashing
```
const bcrypt = require("bcrypt");
const saltRounds = 10;
bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
            });
        });    
```
##### Password Format will be:- "$2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa"

$2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa
 |  |  |                     |
 |  |  |                     hash-value = K0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa
 |  |  |
 |  |  salt = nOUIs5kJ7naTuTFkBy1veu
 |  |
 |  cost-factor => 10 = 2^10 rounds
 |
 hash-algorithm identifier => 2b = BCrypt


## Installation

After downloading this project , and move contents to another folder secrets

Install the dependencies and devDependencies and start the server.

```sh
cd secrets
npm init
npm i  express body-parser mongoose mongoose-encryption dotenv md5 bcrypt ejs
```

> Note: Before moving to run the project once conform you have all npm  packages install inside the `package.json`

#### Building


```sh
node app.js
```


```sh
127.0.0.1:3000
```

## License
No-License


