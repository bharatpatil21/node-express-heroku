const pg = require('pg')

let connectionString = ''

if (process.env.DATABASE_URL) {
  connectionString = process.env.DATABASE_URL
} else {
  console.log('Fatal Error! DATABASE_URL not set!');
  process.exit(1);
}

const client = new pg.Pool({
  connectionString: connectionString
})

const getUsers = (request, response) => {
  client.query('SELECT * FROM salesforce.account ORDER BY id ASC', (error, results) => {
    if (error) {
      console.log('error-----', error)
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  client.query('SELECT * FROM salesforce.account WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name } = request.body

  client.query('SELECT * FROM salesforce.account (name) VALUES ($1)', [name], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${result.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name } = request.body

  client.query(
    'UPDATE salesforce.account SET name = $1 WHERE id = $3',
    [name, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  client.query('DELETE FROM salesforce.account WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}