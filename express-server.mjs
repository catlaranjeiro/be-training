import express from 'express'
import 'dotenv/config'
import birds from './birds.mjs'
import seasons from './seasons.mjs'

const app = express()
const port = process.env.PORT;


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/birds', birds)
app.use('/seasons', seasons)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})