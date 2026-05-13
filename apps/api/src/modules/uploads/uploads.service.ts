import cloudinary from '@/config/cloudinary';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UploadsService {
  async uploadImage(file: Express.Multer.File) {
    if (!file.path) {
      throw new NotFoundException({
        message: 'No file path',
        code: 'NO_FILE_PATH',
      });
    }
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'avatars',
    });
    return result;
  }

  async destroyImage(publicId: string) {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  }
}
