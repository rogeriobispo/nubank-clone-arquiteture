import mongoose, { Schema } from 'mongoose';

const HistoryLogSchema: Schema = new Schema(
  {
    currentUserId: { type: String, required: true },
    eventName: { type: String, required: true },
    message: { type: Object, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('HistoryLog', HistoryLogSchema);
