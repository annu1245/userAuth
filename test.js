const User = require('./models/userModule');

body = {name : "ast",
        email2 : "annupoddar444@gmail.com",
        password : "1234"}

const { name, email2, password } = body;


console.log(name)
console.log(email2)
console.log(password)

const oldUser = User.findOne({ email2 });
console.log(oldUser) 

