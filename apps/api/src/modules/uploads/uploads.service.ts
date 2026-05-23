import cloudinary from '@/config/cloudinary';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import fs from 'fs-extra';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
@Injectable()
export class UploadsService {
  async extractPdfText(file: Express.Multer.File) {
    try {
      const loader = new PDFLoader(file.path);
      const docs = await loader.load();
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 100,
      });
      const chunks = (await splitter.splitDocuments(docs)).slice(0, 10);
      const text = chunks.map((c) => c.pageContent).join('\n\n');
      return text;
    } catch (e) {
      throw new InternalServerErrorException({
        message: 'Failed to parse PDF',
        code: 'PDF_PARSE_ERROR',
      });
    } finally {
      await fs.remove(file.path);
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
    await fs.remove(file.path);
    return result;
  }

  async destroyImage(publicId: string) {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  }
}
