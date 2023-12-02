import { toNano } from '@ton/core';
import { OverflowTest1 } from '../wrappers/OverflowTest1';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const overflowTest1 = provider.open(await OverflowTest1.fromInit());

    await overflowTest1.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(overflowTest1.address);

    // run methods on `overflowTest1`
}
