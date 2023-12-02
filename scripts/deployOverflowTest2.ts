import { toNano } from '@ton/core';
import { OverflowTest2 } from '../wrappers/OverflowTest2';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const overflowTest2 = provider.open(await OverflowTest2.fromInit());

    await overflowTest2.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(overflowTest2.address);

    // run methods on `overflowTest2`
}
