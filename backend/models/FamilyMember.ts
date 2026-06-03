import mongoose, { Schema, Document } from 'mongoose';

export interface IFamilyMember extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  isEmergencyContact: boolean;
  notifyOnMissed: boolean;
  createdAt: Date;
}

const FamilyMemberSchema = new Schema<IFamilyMember>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  isEmergencyContact: { type: Boolean, default: false },
  notifyOnMissed: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.FamilyMember || mongoose.model<IFamilyMember>('FamilyMember', FamilyMemberSchema);
