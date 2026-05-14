import cloudinary from '@/config/cloudinary';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import fs from 'fs-extra';

@Injectable()
export class UploadsService {
  async extractPdfText(file: Express.Multer.File) {
    const fileBuffer = fs.readFileSync(file.path);
    const parser = new PDFParse({ data: fileBuffer });
    try {
      const result = await parser.getText();
      return result;
    } catch (e) {
      await parser.destroy();
      throw new InternalServerErrorException({
        message: 'Failed to parse PDF',
        code: 'PDF_PARSE_ERROR',
      });
    }
  }

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
