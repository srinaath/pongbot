import * as  mongoose from 'mongoose'

const StatsSchema = new mongoose.Schema({
  player: {
    id: String,
    name: String,
    text: String
  },
  wins: Number,
  losses: Number,
  percentage: Number,
  updated: { type: Date, default: Date.now }
});

const model = mongoose.model('Stats', StatsSchema)
export default model