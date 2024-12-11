module.exports = () => ({
  graphql: {
    config: {
      playgroundAlways: true,
      apolloServer: {
        introspection: true
      },
      defaultLimit: 100
    }
  }
});
