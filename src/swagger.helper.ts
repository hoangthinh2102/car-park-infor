/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs';
import * as apiSpecConverter from 'api-spec-converter';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
require('dotenv').config();

export async function initializeSwagger(app: INestApplication) {
  const server = app.getHttpAdapter();
  const serviceName = process.env.SERVICE_NAME;
  const serviceDescription = process.env.SERVICE_DESCRIPTION;
  const apiVersion = process.env.SERVICE_APIVERSION;

  const options = new DocumentBuilder()
    .setTitle(`${serviceName} API Documentation`)
    .setDescription(
      `${serviceDescription} | [swagger.json](swagger.json) | [swagger-2.0.json](swagger-2.0.json)`,
    )
    .setVersion(apiVersion)
    .addServer(
      `${process.env.SERVER_SWAGGERSCHEMA}://${process.env.SERVER_HOSTNAME}`,
    )
    .addBearerAuth({ type: 'apiKey', name: 'authorization', in: 'header' })
    .build();

  const [swagger2, oas3] = await generateSwaggerSpecs(app, options);
  writeSwaggerJson(`${process.cwd()}`, swagger2, oas3);

  server.get(`${process.env.SERVICE_DOCSBASEURL}/swagger.json`, (req, res) => {
    res.json(oas3);
  });
  server.get(
    `${process.env.SERVICE_DOCSBASEURL}/swagger-2.0.json`,
    (req, res) => {
      res.json(swagger2);
    },
  );

  SwaggerModule.setup(process.env.SERVICE_DOCSBASEURL, app, oas3, {
    swaggerOptions: {
      displayOperationId: true,
    },
  });
}

async function generateSwaggerSpecs(
  app: INestApplication,
  config: Omit<OpenAPIObject, 'paths'>,
): Promise<[any, OpenAPIObject]> {
  const oas3: OpenAPIObject = SwaggerModule.createDocument(app, config);
  const swagger2 = await apiSpecConverter
    .convert({
      from: 'openapi_3',
      to: 'swagger_2',
      source: oas3,
    })
    .then((converted) => {
      return converted.spec;
    });
  return [swagger2, oas3];
}

function writeSwaggerJson(path: string, swagger2: any, oas3: OpenAPIObject) {
  const swaggerFile = `${path}/swagger.json`;
  const swaggerFile2 = `${path}/swagger-2.0.json`;
  fs.writeFileSync(swaggerFile, JSON.stringify(oas3, null, 2), {
    encoding: 'utf8',
  });
  fs.writeFileSync(swaggerFile2, JSON.stringify(swagger2, null, 2), {
    encoding: 'utf8',
  });
}
