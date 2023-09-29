class InitializeService {
  constructor(db) {
    this.sequelize = db.sequelize;
  }

  async initiliaze() {
    try {
      await this.sequelize.query("INSERT INTO ROLES (role) VALUES ('admin')");
      await this.sequelize.query("INSERT INTO ROLES (role) VALUES ('member')");
    } catch (err) {}
  }
}

module.exports = InitializeService;
