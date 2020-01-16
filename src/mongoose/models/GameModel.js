import * as  mongoose from 'mongoose'

const GameSchema = new mongoose.Schema({
  winner: {
    id: String,
    name: String,
    text: String
  },
  loser: {
    id: String,
    name: String,
    text: String
  },
  winnerSet: Number,
  loserSet: Number,
  updated_at: { type: Date, default: Date.now },
});

const model = mongoose.model('Game', GameSchema)
export default model