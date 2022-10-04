const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/book');
const mongoose = require('mongoose').default
const app = express();
mongoose.connect('mongodb://root:root@localhost:27017/test?authSource=admin',(err)=>{
    console.log(err)
    console.log('connect db')
})
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:true
}))
app.listen(4000, () => {
    console.log('server start')
})
