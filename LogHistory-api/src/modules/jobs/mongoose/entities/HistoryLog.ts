import mongoose, { Schema } from 'mongoose';

const HistoryLogSchema: Schema = new Schema({
  userId: { type: String, required: true },
  eventName: { type: String, required: true },
  message: { type: Object, required: true },
});

export default mongoose.model('HistoryLog', HistoryLogSchema);
