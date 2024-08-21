import fs from 'fs';
import path from 'path';
import {
  //createDataItemSigner,
  connect,
} from '@permaweb/aoconnect';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const process = 'kILNJ7rIw6nUjJpBnyw9LQNpdRzNm4pns1bZxZnR_No';

  const txId = 'ur71-RBt64V6tuClAY7ubkkE5Zb25odpkbNO92N-9Ms';

  const wallet = fs.readFileSync(path.join(__dirname, 'key.json'), 'utf-8');
  // const signer = createDataItemSigner(JSON.parse(wallet));

  const ao = connect();

  const assignRes = await ao.assign({
    process,
    message: txId,
  });

  console.dir(assignRes, { depth: null });
}

main();
