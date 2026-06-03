import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicineSchedule extends Document {
  userId: mongoose.Types.ObjectId;
  medicineId: mongoose.Types.ObjectId;
  scheduledTime: Date;
  status: 'pending' | 'taken' | 'skipped' | 'snoozed';
  takenAt?: Date;
  notes?: string;
  createdAt: Date;
}

const MedicineScheduleSchema = new Schema<IMedicineSchedule>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  medicineId: { type: Schema.Types.ObjectId, ref: 'Medicine', required: true },
  scheduledTime: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'taken', 'skipped', 'snoozed'], default: 'pending' },
  takenAt: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

MedicineScheduleSchema.index({ userId: 1, scheduledTime: 1 });
MedicineScheduleSchema.index({ userId: 1, status: 1 });

export default mongoose.models.MedicineSchedule || mongoose.model<IMedicineSchedule>('MedicineSchedule', MedicineScheduleSchema);
