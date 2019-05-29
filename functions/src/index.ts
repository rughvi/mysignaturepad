import * as functions from 'firebase-functions';
import app from './App'

const port = process.env.PORT || 3000

app.listen(port, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log(`server is listening on ${port}`)
  return 
})

exports.app = functions.https.onRequest(app);