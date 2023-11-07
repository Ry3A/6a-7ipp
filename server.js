const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLID } = require('graphql');

// Создаем тип данных для книги
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: { type: GraphQLString },
    },
});

// Данные для книг
const books = [
    { id: '1', name: 'Book 1', genre: 'Genre 1', author: 'Author 1' },
    { id: '2', name: 'Book 2', genre: 'Genre 2', author: 'Author 2' },
];

// Создаем корневой запрос
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return books.find(book => book.id === args.id);
            },
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return books;
            },
        },
    },
});

// Создаем мутации (для добавления книги)
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                author: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve(parent, args) {
                const newBook = {
                    id: String(books.length + 1),
                    name: args.name,
                    genre: args.genre,
                    author: args.author,
                };
                books.push(newBook);
                return newBook;
            },
        },
    },
});

// Создаем схему GraphQL
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

const app = express();

// Используем graphqlHTTP для создания сервера GraphQL
app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true, // Включаем GraphiQL интерфейс для тестирования
    })
);

app.listen(4000, () => {
    console.log('Сервер GraphQL запущен на порту 4000');
});

/*
Добавление книги
mutation {
    addBook(name: "Название книги", genre: "Жанр книги", author: "Автор книги") {
        id
        name
        genre
        author
    }
}
Получение списка книг
{
    books {
    id
    name
    genre
    author
}
}
Получение книги по айди
query {
    book(id: 2) {
        id
        name
        genre
        author
    }
}*/