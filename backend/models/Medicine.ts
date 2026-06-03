import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  dosage: string;
  quantity: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  times: string[];
  duration: {
    startDate: Date;
    endDate?: Date;
    days?: number[];
  };
  instructions?: string;
  category: string;
  color: string;
  remainingQuantity: number;
  refillAt: number;
  isActive: boolean;
  createdAt: Date;
}

const MedicineSchema = new Schema<IMedicine>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  quantity: { type: Number, required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'custom'], default: 'daily' },
  times: [{ type: String, required: true }],
  duration: {
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    days: [{ type: Number }],
  },
  instructions: { type: String },
  category: { type: String, default: 'general' },
  color: { type: String, default: '#3B82F6' },
  remainingQuantity: { type: Number, required: true },
  refillAt: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Medicine || mongoose.model<IMedicine>('Medicine', MedicineSchema);
