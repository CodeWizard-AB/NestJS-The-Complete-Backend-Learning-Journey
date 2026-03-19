import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { Model } from 'mongoose';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
  ) {}

  async saveFile(file: Express.Multer.File) {
    const newFile = await this.fileModel.create({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      path: file.path,
      mimetype: file.mimetype,
    });
    return newFile;
  }

  async getAllFiles() {
    return await this.fileModel.find();
  }

  async getFileById(id: string) {
    return await this.fileModel.findById(id);
  }

  async deleteFile(id: string) {
    const file = await this.fileModel.findById(id);

    if (file) {
      if (existsSync(file.path)) {
        unlinkSync(file.path);
        await this.fileModel.findByIdAndDelete(id);
      }
    } else {
      throw new NotFoundException('File not found');
    }

    return { message: 'File deleted successfully' };
  }
}
