const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()
app.use(express.json())
const dbpath = path.join(__dirname, 'cricketTeam.db')
let db = null

const initializeDBToServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBToServer()

//Returns a list of all players in the team
app.get('/players/', async (request, response) => {
  const getPlayerQuery = `
  SELECT
  *
  FROM
  cricket_team;`
  const playersArray = await db.all(getPlayerQuery)
  response.send(playersArray)
})

//Creates a new player in the team (database). player_id is auto-incremented
app.post('/players/', async (request, response) => {
  const playersDetail = request.body
  const {player_name, jersey_number, role} = playersDetail
  const addPlayersQuery = `
  INSERT INTO
  cricket_team (player_name,jersey_number,role)
  VALUES
  (
    '${player_name}',
    '${jersey_number}',
    '${role}'
  );`
  const playersData = await db.run(addPlayersQuery)
  response.send('Player Added to Team')
})

//Returns a player based on a player ID
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
  SELECT
  *
  FROM
  cricket_team
  WHERE
  player_id= ${playerId};`
  const playersArray = await db.get(getPlayerQuery)
  response.send(playersArray)
})

//Updates the details of a player in the team (database) based on the player ID
app.put('/players/:playerId/', async (request, response) => {
  const {playersId} = request.params
  const playersDetail = request.body
  const {player_name, jersey_number, role} = playersDetail
  const addPlayersQuery = `
  UPDATE
  cricket_team 
  SET
    player_name='${player_name}',
    jersey_number='${jersey_number}',
    role='${role}'
  WHERE
  player_id='${playersId}';`
  const playersData = await db.run(addPlayersQuery)
  response.send('Player Details Updated')
})

//Deletes a player from the team (database) based on the player ID
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
  SELECT
  *
  FROM
  cricket_team
  WHERE
  player_id= ${playerId};`
  const playersArray = await db.get(getPlayerQuery)
  response.send('Player Removed')
})
