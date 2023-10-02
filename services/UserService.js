class UserService {
  constructor(db) {
    this.User = db.User;
  }

  async create(name, email, password, passwordsalt) {
    return await this.User.create({
      name: name,
      email: email,
      password: password,
      passwordsalt: passwordsalt,
      RoleId: 2,
    }).catch((err) => {
      console.error(err.errors[0].type);
      if (err.errors[0].type == 'unique violation') return { error: 'duplicate' };
      else return { error: err };
    });
  }

  async getByEmail(email) {
    return await this.User.findOne({ where: { email: email } }).catch((err) => {
      console.error(err);
    });
  }
}

module.exports = UserService;
