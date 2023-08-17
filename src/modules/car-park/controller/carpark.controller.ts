import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fastcsv from 'fast-csv';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CarParkService } from '../services/carpark.service';
import { CarParkPaginationDto, CreateCarParkDto } from '../dtos/carpark.dto';
import { Readable } from 'stream';

@ApiTags('car-park')
@Controller('car-parking')
export class CarParkingController {
  constructor(private readonly carParkService: CarParkService) {}

  @ApiOperation({
    operationId: 'importCsvFile',
    description: 'Batch job import csv file',
  })
  @ApiConsumes('multipart/form-data')
  @Post('import-csv')
  @UseInterceptors(FileInterceptor('file'))
  async importCsvFile(@UploadedFile() file: Express.Multer.File) {
    const stream = Readable.from(file.buffer.toString());
    const results = [];
    const data = await new Promise((resolve, reject) => {
      fastcsv
        .parseStream(stream, { headers: true })
        .on('data', (row) => results.push(row))
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
    const dataArray = data as Array<{ [key: string]: string }>;
    const dataToImport = dataArray.map((row) =>
      Object.assign(new CreateCarParkDto(), row),
    );
    return this.carParkService.processImport(dataToImport);
  }

  @ApiOperation({
    operationId: 'paginate',
    description: 'Get car park pagination',
  })
  @Get('pagination')
  pagination(@Query() query: CarParkPaginationDto) {
    return this.carParkService.pagination(query);
  }
}
