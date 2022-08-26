import express from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb'
import 'dotenv/config'

const URI = process.env.MONGO_URI
const client = new MongoClient(URI)
const database = client.db('shopping-app')
const products = database.collection('products')

client.connect()
console.log('connected to mongo')

const app = express()
app.use(cors())
app.use(express.json())

app.listen(4040, () => console.log('API running on port 4040'))

app.get('/', async (req, res) => {
  const allProducts = await products.find().toArray()
  res.send(allProducts)
})

app.post('/add-product', async (req, res) => {
  console.log(req.body)
  await products.insertOne(req.body)
  res.send('Item was added to Mongo')
})

app.delete('/delete', async (req, res) => {
  await products.findOneAndDelete({ _id: ObjectId(req.query) })
  res.send('Item was deleted in mongo')
})

app.put('/update', async (req, res) => {
  console.log(req.query)
  console.log(req.body)
  // await products.findOneAndUpdate({ _id: ObjectId(req.query) }, { $set: req.body })
  await products.findOneAndUpdate(req.query, { $set: req.body })
  res.send('Item was updated in mongo')
})
