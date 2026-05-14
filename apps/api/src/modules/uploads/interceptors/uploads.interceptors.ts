import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const ImageInterceptor = (name: string) =>
  FileInterceptor(name, {
    storage: diskStorage({
      destination: './uploads/images',
      filename: (_req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

        cb(null, uniqueName + extname(file.originalname));
      },
    }),
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(
          new BadRequestException({
            message: 'Only image files are allowed',
            code: 'ONLY_IMAGE_ALLOWED',
          }),
          false,
        );
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });

export const PDFInterceptor = (name: string) =>
  FileInterceptor(name, {
    storage: diskStorage({
      destination: './uploads/pdfs',
      filename: (_req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

        cb(null, uniqueName + extname(file.originalname));
      },
    }),
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.includes('pdf')) {
        return cb(
          new BadRequestException({
            message: 'Only PDFs allowed',
            code: 'ONLY_PDF_ALLOWED',
          }),
          false,
        );
      }
      cb(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });
