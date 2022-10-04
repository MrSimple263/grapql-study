const {GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLList, GraphQLID} = require('graphql');
const _ = require("lodash");
const BookModel = require('../model/book')
const AuthorModel = require('../model/author')

const Author = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: GraphQLList(Book),
            resolve(parent, args) {
                return BookModel.find({author:parent.id})
            }
        }
    })
})
// Construct a schema, using GraphQL schema language
const Book = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLString},
        author: {
            type: Author,
            resolve(parent, args) {
                return AuthorModel.findById(parent.author)
            }
        },
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
    })
});
const rootQuery = new GraphQLObjectType({
    name: 'root',
    fields: () => ({
        book: {
            type: Book,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return BookModel.findById(args.id)
            }
        },
        author: {
            type: Author,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return AuthorModel.findById(args.id)
            }
        },
        books: {
            type: GraphQLList(Book),
            resolve(parent, args) {
                return BookModel.find({})
            }
        },
        authors: {
            type: GraphQLList(Author),
            resolve(parent, args) {
                return AuthorModel.find({})
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: Author,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parent, args) {
                let author = new AuthorModel({
                    name: args.name,
                    age: args.age
                })
                return author.save()
            }
        },
        addBook: {
            type: Book,
            args: {
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
                author: {type: GraphQLID}
            },
            resolve(parent, args) {
                let book = new BookModel({
                    name: args.name,
                    genre: args.genre,
                    author: args.author
                })
                return book.save();
            }
        }
    }
})
module.exports = new GraphQLSchema({
    query: rootQuery,
    mutation: Mutation
})
