import dotenv from 'dotenv'; 
import minimist from 'minimist';
import fs from 'fs';

const argv = minimist(process.argv.slice(2));

dotenv.config({
  path: [`${__dirname}/../env/.env.${argv.env}`, `${__dirname}/../env/.env.${argv.env}.user`]
});

const schemaFile = fs.readFileSync(`${__dirname}/schema.json`, 'utf8');
const schema = JSON.parse(schemaFile);

export const config = {
  debug: argv.debug ?? false,
  //tenantId: 'common',
  clientId: process.env.AZURE_CLIENT_ID,
  certPath: process.env.AZURE_CLIENT_CERTIFICATE_PATH,
  //clientSecret: argv.secret,
  connector: {
    id: `${process.env.CONNECTOR_ID}${process.env.CONNECTOR_ID_SUFFIX}`,
    name: process.env.CONNECTOR_NAME,
    description: process.env.CONNECTOR_DESCRIPTION,
    schema: schema,
    baseUrl: process.env.CONNECTOR_BASE_URL
  }
}

console.log(config);