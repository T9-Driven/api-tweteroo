import express from 'express'
import cors from 'cors'
import chalk from 'chalk'

const app = express()
app.use(express.json())
app.use(cors())

const users = []
const tweets = []

app.post("/sign-up", (req, res) => {
  const user = req.body

  if (!user.username || !user.avatar) return res.status(400).send("Todos os campos são obrigatórios!")

  users.push(user)

  res.status(201).send("OK")
})

app.post("/tweets", (req, res) => {
  const tweet = req.body.tweet
  const username = req.headers.username

  if (!username || !tweet) return res.status(400).send("Todos os campos são obrigatórios!")

  const userExists = users.find(item => item.username === username)

  if (!userExists) return res.status(401).send("UNAUTHORIZED")

  tweets.push({ tweet, username })

  res.status(201).send("OK")
})

app.get("/tweets", (req, res) => {
  let i = 0;
  const page = req.query.page

  if (page && page < 1) return res.status(400).send("Informe uma página válida!")

  const limit = 10;
  const start = (page - 1) * limit;
  const end = page * limit;

  const filteredTweets = tweets.map(tweet => {
    const user = users.find(item => item.username === tweet.username)
    const response = { username: tweet.username, tweet: `> ${tweet.tweet} | ${i}`, avatar: user.avatar }
    i++
    return response
  })


  if (page) {
    return res.send(filteredTweets.reverse().slice(start, end))
  }
  res.send(filteredTweets.slice(-10))
})

app.get("/tweets/:username", (req, res) => {
  const { username } = req.params

  const filteredUserTweets = tweets.filter(tweet => {

    if (tweet.username.toLowerCase() === username.toLowerCase()) {
      const user = users.find(item => item.username === tweet.username)
      return { ...tweet, avatar: user.avatar }
    }
  })

  res.send(filteredUserTweets)
})

const PORT = 5008

app.listen(PORT, () => console.log(chalk.blue(`Servidor roudou de boas aqui => ${PORT}`)))