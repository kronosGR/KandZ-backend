class InitializeService {
  constructor(db) {
    this.sequelize = db.sequelize;
  }

  async initiliaze() {
    await this.sequelize.query("INSERT INTO ROLES (role) VALUES ('admin')");
    await this.sequelize.query("INSERT INTO ROLES (role) VALUES ('member')");
  }
}

module.exports = InitializeService;
