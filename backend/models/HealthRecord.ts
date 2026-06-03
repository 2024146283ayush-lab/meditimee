import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthRecord extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  type: 'prescription' | 'report' | 'lab_test' | 'doctor_note' | 'other';
  fileUrl?: string;
  notes?: string;
  date: Date;
  doctorName?: string;
  createdAt: Date;
}

const HealthRecordSchema = new Schema<IHealthRecord>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['prescription', 'report', 'lab_test', 'doctor_note', 'other'], required: true },
  fileUrl: { type: String },
  notes: { type: String },
  date: { type: Date, required: true },
  doctorName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.HealthRecord || mongoose.model<IHealthRecord>('HealthRecord', HealthRecordSchema);
