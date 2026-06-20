const { DataTypes } = require('sequelize')

const currentYear = new Date().getFullYear()

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('blogs', 'year', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: currentYear
    })

    await queryInterface.sequelize.query(`
      ALTER TABLE blogs
      ADD CONSTRAINT blogs_year_valid
      CHECK (
        year >= 1991
        AND year <= EXTRACT(YEAR FROM CURRENT_DATE)
      )
    `)
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE blogs
      DROP CONSTRAINT IF EXISTS blogs_year_valid
    `)

    await queryInterface.removeColumn('blogs', 'year')
  }
}