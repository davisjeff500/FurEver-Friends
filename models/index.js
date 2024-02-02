const User = require('./User');
const Dog = require('./Dog');

User.hasMany(Project, {
foreignKey: 'user_id',
onDelete: 'CASCADE'
});

Project.belongsTo(Userser, {
foreignKey: 'user_id'
});

module.exports = { User, Dog };
