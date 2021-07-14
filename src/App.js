import React, {useCallback, useState} from 'react'
import faunadb from 'faunadb'

const currentDate = new Date().toISOString().substr(0, 10)

const faunadbClient = new faunadb.Client({
  secret: process.env.REACT_APP_FAUNADB_SECRET,
})
const q = faunadb.query

function App() {
  const [tweet, setTweet] = useState('')
  const [date, setDate] = useState(currentDate)
  const [time, setTime] = useState(
    new Date().getHours() + ':' + new Date().getMinutes()
  )

  const sendTweet = useCallback(
    async (event) => {
      event.preventDefault()

      console.log(new Date(`${date} ${time}`).getTime())
      console.log(new Date(`${date} ${time}`))

      try {
        faunadbClient.query(
          q.Create(q.Collection('tweets'), {
            data: {
              tweet,
              date: new Date(`${date} ${time}`).getTime(),
            },
          })
        )

        setTweet('')
      } catch (error) {
        console.log(error)
      }
    },
    [date, time, tweet]
  )

  return (
    <form
      onSubmit={sendTweet}
      className="flex flex-col max-w-lg m-auto min-h-screen justify-center"
    >
      <h2 className="mb-6 text-center text-3xl font-extrabold text-gray-900">
        Your Tweet
      </h2>
      <textarea
        required
        maxLength="280"
        rows="5"
        className="mb-6 focus:ring-indigo-500 focus:border-indigo-500 border-2 w-full p-4 sm:text-sm border-gray-300 rounded-md"
        placeholder="I don't understand pineapple pizza"
        value={tweet}
        onChange={(event) => setTweet(event.target.value)}
      />
      <div className="flex items-center mb-8">
        <input
          required
          type="date"
          min={currentDate}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="focus:ring-indigo-500 focus:border-indigo-500 border-2 w-full p-4 sm:text-sm border-gray-300 rounded-md mx-4"
        />
        <input
          required
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          className="focus:ring-indigo-500 focus:border-indigo-500 border-2 w-full p-4 sm:text-sm border-gray-300 rounded-md mx-4"
        />
      </div>
      <button
        type="submit"
        className="flex justify-center py-4 px-4 border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Schedule Tweet
      </button>
    </form>
  )
}

export default App
