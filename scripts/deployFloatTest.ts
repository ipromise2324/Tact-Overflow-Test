import { toNano } from '@ton/core';
import { FloatTest } from '../wrappers/FloatTest';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const floatTest = provider.open(await FloatTest.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await floatTest.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(floatTest.address);

    console.log('ID', await floatTest.getId());
}
