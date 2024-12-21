import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) { }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 1 }], {
      limits: { files: 1 },
    }),
  )
  public uploadImages(@UploadedFiles() file: { files: Express.Multer.File[] }) {
    console.log(file);
    if (!file) throw new Error('No files uploaded');
    const { files } = file;
    return this.fileUploadService.upload(files);
  }
}
