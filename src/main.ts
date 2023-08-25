import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Tracebeef API - Rastreabilidade')
    .addBearerAuth()
    .setDescription(
      `Esta API recupera os dados de rastreabilidade em JSON á partir de 2 métodos, por MD5 ou por parâmetros.\n
      A autenticação é feita através de um token JWT, que deve ser enviado no header da requisição.\n
      Para obter o token, utilize o endpoint /create-token.\n
      Instruções de uso:\n
      Modelo de requisição por MD5:\n
      Estrutura padrão do MD5: sif + appGen + dtprod + lp + sku\n
      Onde:\n
      sif: Sif da unidade produtora\n
      appGen: Constante de aplicação, valor fixo informado pelo suporte\n
      dtprod: Data do abate (formato ISO 8601) sem o hífen Exemplo: 20210101\n
      lp: Lote de produção\n
      sku: SKU que identifica o produto\n

      sif e dt_abate
      sif e op e SKU
    
      [Termos de uso](https://ecotrace.info/termos-de-uso/)\n
    `
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();