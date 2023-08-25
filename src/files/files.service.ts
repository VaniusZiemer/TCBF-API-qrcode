import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  private s3 = new S3();

  async getFileStream(md5: string, sif: string): Promise<Readable | null> {
    // Aqui você deve implementar a lógica para verificar o token JWT.
    // Se o token for válido, você pode prosseguir com o acesso ao arquivo.
    // Caso contrário, retorne null ou lance uma exceção.

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${sif}/${md5}/payload.json`,
    };

    console.log(params.Key);
    const s3Object = await this.s3.getObject(params).promise();

    if (s3Object.Body) {
      const readableStream = new Readable();
      readableStream.push(s3Object.Body);
      readableStream.push(null);
      return readableStream;
    }

    return null;
  }
}