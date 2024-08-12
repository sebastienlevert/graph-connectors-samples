import { config } from './Config';
import { initClient } from './GraphClient';

const { id, name, description } = config.connector;
let client = initClient();

async function createConnection() {  
  if(config.debug) {
    console.log(`POST: /external/connections`);
    console.log(`Connection: ${JSON.stringify({
      id,
      name,
      description
    }, null, 2)}`);
  }

  console.log(`Creating connection ${id}. This should take under 10 minutes...`);

  await client
    .api('/external/connections')
    .post({
      id,
      name,
      description
    });

  console.log(`Connection ${id} was created`);
}

async function getConnection(): Promise<any> {
  if(config.debug) {
    console.log(`GET: /external/connections/${id}`);
  }

  const connection = await client
    .api(`/external/connections/${id}`)
    .get();

  return connection;
}

export async function ensureConnection(): Promise<boolean> {  
  try {
    client = initClient();
    await getConnection();
    console.log(`Connection ${id} already exists`);
    return true;
  } catch (e) {
    // The connection does not exist, so we need to create it
    if(e.statusCode === 404) {
      await createConnection();
      return true;
    } 

    console.error(e);

    return false;
  }
}