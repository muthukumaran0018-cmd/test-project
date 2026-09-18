import { BaseRepository } from './BaseRepository.js';
import { User, IUser } from '../models/User.model.js';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    const query = this.model.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+password');
    }
    return query.exec();
  }

  async addRefreshToken(userId: string, token: string): Promise<void> {
    await this.model.findByIdAndUpdate(userId, {
      $push: { refreshTokens: token },
    });
  }

  async removeRefreshToken(userId: string, token: string): Promise<void> {
    await this.model.findByIdAndUpdate(userId, {
      $pull: { refreshTokens: token },
    });
  }

  async clearAllRefreshTokens(userId: string): Promise<void> {
    await this.model.findByIdAndUpdate(userId, {
      $set: { refreshTokens: [] },
    });
  }

  async findByIdWithMfaSecret(userId: string): Promise<IUser | null> {
    return this.model.findById(userId).select('+mfaSecret').exec();
  }
}

export const userRepository = new UserRepository();
