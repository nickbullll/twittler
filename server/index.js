const express = require('express')
const cron = require('node-cron')
const faunadb = require('faunadb')
const {TwitterApi} = require('twitter-api-v2')

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN)

const q = faunadb.query

const faunaClient = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNADB_SECRET,
})

// run every minute
cron.schedule('* * * * *', async () => {
  const now = new Date()
  now.setSeconds(0)
  now.setMilliseconds(0)

  try {
    // get all tweets from Now - 1 minute to Now
    const {data} = await faunaClient.query(
      q.Map(
        q.Paginate(q.Match(q.Index('tweetsByDate'), now.getTime())),
        q.Lambda(['date', 'ref'], q.Get(q.Var('ref')))
      )
    )

    // post all tweets from date range on twitter
    data.forEach(async ({data: {tweet}}) => {
      try {
        console.log(tweet)
        await twitterClient.v1.tweet(tweet)
      } catch (error) {
        console.log(error)
      }
    })
  } catch (error) {
    console.log(error)
  }
})

const app = express()

app.listen(3001, async () => {
  console.log(`Server listening on ${3001}`)
})
