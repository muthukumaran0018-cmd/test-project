import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { logger } from './logger.js';

if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  logger.info('✅ Cloudinary initialized.');
} else {
  logger.warn('⚠️ Cloudinary keys not provided. Media upload will fallback to mock URLs.');
}

export const uploadToCloudinary = async (fileBuffer: string, folder = 'tripsecure'): Promise<string> => {
  if (!env.CLOUDINARY_CLOUD_NAME) {
    return `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;
  }
  try {
    const result = await cloudinary.uploader.upload(fileBuffer, {
      folder,
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (err) {
    logger.error('Cloudinary upload error:', err);
    throw new Error('Image upload failed');
  }
};

export { cloudinary };
