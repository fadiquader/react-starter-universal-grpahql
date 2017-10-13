export default `
  type User {
    id: Int!
    email: String
  }
  type NewsItem {
    title: String!
    link: String!
    author: String
    pubDate: String!
    content: String
  }
  type IntlMessage {
    id: String!
    defaultMessage: String!
    message: String
    description: String
    files: [String!]
  }
  type Query {
    me: User!
    news: [NewsItem]!
    intl(locale: String!): [IntlMessage!]! 
  }
  
  type AuthPayload {
    token: String!
  }
  
  type Mutation {
    login(email: String!, password: String!): AuthPayload!
  }
  
`;
