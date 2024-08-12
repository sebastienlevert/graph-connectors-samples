import { delay } from './Common';
import { config } from './Config';
import { initClient } from './GraphClient';

const { id, schema } = config.connector;
const client = initClient();

async function createSchema() {
  try {
    if(config.debug) {
      console.log(`POST: /external/connections/${id}/schema`);
      console.log(`Schema: ${JSON.stringify(schema, null, 2)}`);
    }

    await client
      .api(`/external/connections/${id}/schema`)
      .header('content-type', 'application/json')
      .post({
        baseType: 'microsoft.graph.externalItem',
        properties: schema
      });
    
    console.log(`Schema for connection ${id} was created`);
  }
  catch (e) {
    console.error(e);
  }
}

async function getSchema(): Promise<any> {
  if(config.debug) {
    console.log(`GET: /external/connections/${id}/schema`);
  }

  await client
    .api(`/external/connections/${id}/schema`)
    .get();
}

export async function ensureSchema() {  
  try {
    await getSchema();
  } catch (e) {
    if(e.statusCode === 404) {
      await createSchema();
    } else {
      await delay(10000);
      ensureSchema();
    }
  }
}