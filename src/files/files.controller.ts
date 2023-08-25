import { Controller, Get, Param, Headers, NotFoundException, Res, UseGuards, Query } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard'; // Importe o AuthGuard
import { createHash } from 'crypto';

@ApiTags('JSON Data')
@Controller('data')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({ summary: 'Retorna os dados pelo MD5' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'sif', description: 'Sif da unidade produtora', type: String, example: '0000', required: true})
  @ApiQuery({ name: 'md5', description: 'Hash gerada conforme as regras pré determinadas', type: String, required: true})
  @UseGuards(AuthGuard) // Aplica o AuthGuard
  @Get('md5')
  async getByMD5(@Query('sif') sif: string, @Query('md5') md5: string, @Res() res: Response) {

    const fileStream = await this.filesService.getFileStream(md5, sif);

    if (!fileStream) {
      throw new NotFoundException('File not found');
    }

    res.setHeader('Content-Type', 'application/json');
    fileStream.pipe(res);
  }


  @ApiOperation({ summary: 'Retorna os dados pelo MD5' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'sif', description: 'Sif da unidade produtora', type: String, example: '0000', required: true})
  @ApiQuery({ name: 'dtprod', description: 'Data de produção (formato ISO 8601)', type: String, example: '2023-01-01', required: true })
  @ApiQuery({ name: 'lp', description: 'Lote de produção', type: Number , example: 12345, required: true })
  @ApiQuery({ name: 'sku', description: 'SKU que identifica o produto', type: Number , example: 888888, required: true })
  @UseGuards(AuthGuard) 
  @Get('params')
  async getByParams(@Query('sif') sif: string, @Query('dtprod') dtprod: string,@Query('lp') lp: string,@Query('sku') sku: string,  @Res() res: Response) {
    const appGen = 'ECOTR@C3';


    const hashMD5 = createHash('md5');
    hashMD5.update(`${sif}${appGen}${dtprod.split('-').join('')}${lp}${sku}`);

    


    const md5 = hashMD5.digest('hex');

    const fileStream = await this.filesService.getFileStream(md5, sif);

    if (!fileStream) {
      throw new NotFoundException('File not found');
    }

    res.setHeader('Content-Type', 'application/json');
    fileStream.pipe(res);
  }
}
