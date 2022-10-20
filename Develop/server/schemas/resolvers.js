const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },

    },

    Mutation: {

        //addUser, accepts a username, email and password as params, returns auth type
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        //login, returns an auth type
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },

        //saveBook, accepts a book authos arry, description, title, bookId, image and link
        //as params, returns a User (use "input")

        //removeBook, accepts bookId as a param, returns User type

    }
};

module.exports = resolvers;