import fs from 'fs';
import path from 'path';
import { createDataItemSigner, connect } from '@permaweb/aoconnect';
import { fileURLToPath } from 'url';
/**
 * Example of how to spawn from terminal:
 * 
 aos \
 --wallet=key.json \
 --tag-name=Extension --tag-value=WeaveDrive \
 --tag-name=Variant --tag-value=weavedrive.1 \
 --tag-name=Availability-Type --tag-value=Assigned \
 --tag-name=Attestor --tag-value=7waR8v4STuwPnTck1zFVkQqJh5K9q9Zik4Y5-5dV7nk \
 weavedrive-enabled2
 */

/**
Send a read file message:
   Send({Target = ao.id, Action = "Get-Tx", ["Tx-Id"] = "ur71-RBt64V6tuClAY7ubkkE5Zb25odpkbNO92N-9Ms"})
  */

/**
Attest a txid:
   refer to assign-tx.ts for example
  */

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ao = connect({
  GATEWAY_URL: 'https://arweave.net',
});
const moduleId = 'cbn0KKrBZH7hdNkNokuXLtGryrWM--PjSTBqIzw9Kkk';
const scheduler = '_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA';

async function main() {
  const luaCode = fs.readFileSync(
    path.join(__dirname, '../dist/aos-bundled.lua'),
    'utf-8',
  );

  const wallet = fs.readFileSync(path.join(__dirname, 'key.json'), 'utf-8');
  const signer = createDataItemSigner(JSON.parse(wallet));

  const processId = await ao.spawn({
    module: moduleId,
    scheduler,
    signer,
    tags: [
      { name: 'Extension', value: 'WeaveDrive' },
      { name: 'Variant', value: 'weavedrive.1' },
      { name: 'Availability-Type', value: 'Assigned' },
      {
        name: 'Attestor',
        value: '7waR8v4STuwPnTck1zFVkQqJh5K9q9Zik4Y5-5dV7nk',
      },
    ],
  });

  console.log('Process ID:', processId);
  console.log('Waiting 20 seconds to ensure process is readied.');
  await new Promise((resolve) => setTimeout(resolve, 20_000));
  console.log('Loading ANT Lua code...');

  const testCases: any = [['Eval', {}, luaCode]];

  for (const [method, args, data] of testCases) {
    const tags: { name: string; value: any }[] = args
      ? Object.entries(args).map(([key, value]) => ({ name: key, value }))
      : [];
    const result = await ao
      .message({
        process: processId,
        tags: [...tags, { name: 'Action', value: method }],
        data,
        signer,
      })
      .catch((e) => e);

    console.dir({ method, result }, { depth: null });
  }
}

main();
