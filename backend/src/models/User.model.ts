import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export type SystemRole = 'admin' | 'operator' | 'driver' | 'conductor' | 'passenger';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: SystemRole;
  phone?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  resetPasswordOTP?: string;
  resetPasswordExpires?: Date;
  mfaEnabled: boolean;
  mfaSecret?: string;
  refreshTokens: string[];
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['admin', 'operator', 'driver', 'conductor', 'passenger'],
      default: 'passenger',
      index: true,
    },
    phone: { type: String, trim: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String, select: false },
    refreshTokens: [{ type: String }],
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password!);
};

// Soft delete filter plugin query middleware
UserSchema.pre(/^find/, function (this: mongoose.Query<any, any>, next) {
  if (!(this as any)._conditions.includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
