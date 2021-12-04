module.exports = (sequelize, Sequelize) => {
  const Birthday = sequelize.define("birthday", {
    username: {
      type: Sequelize.STRING
    },
    dateOfBirth: {
      type: Sequelize.STRING
    }
  });

  return Birthday;
};
