import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phone?: string;
  photoURL?: string;
  preferredLanguage: 'en' | 'hi';
  preferredTheme: 'light' | 'dark';
  accessibilitySettings: {
    largeFonts: boolean;
    highContrast: boolean;
    voiceNavigation: boolean;
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  photoURL: { type: String },
  preferredLanguage: { type: String, enum: ['en', 'hi'], default: 'en' },
  preferredTheme: { type: String, enum: ['light', 'dark'], default: 'light' },
  accessibilitySettings: {
    largeFonts: { type: Boolean, default: false },
    highContrast: { type: Boolean, default: false },
    voiceNavigation: { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
