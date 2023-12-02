import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { OverflowTest2 } from '../wrappers/OverflowTest2';
import '@ton/test-utils';

describe('OverflowTest2', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let overflowTest2: SandboxContract<OverflowTest2>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        overflowTest2 = blockchain.openContract(await OverflowTest2.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await overflowTest2.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: overflowTest2.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and overflowTest2 are ready to use
    });

    it('should not increase counter when overflow', async () => {
        let increaseBy = 128n;
        const increaseResult = await overflowTest2.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Mul',
                amount: increaseBy,
            }
        );

        // increaseBy is 128 and the counter is 1, 1 * 128 > 127 so it should fail
        expect(increaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: overflowTest2.address,
            success: false,
        });
    });

    it('should increase counter', async () => {
        let increaseBy = 25n;
        const increaseReultBefore = await overflowTest2.getGetCounter();
        //console.log("increaseReultBefore ",increaseReultBefore);
        const increaseResult = await overflowTest2.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Mul',
                amount: increaseBy,
            }
        );
        const increaseReultAfter = await overflowTest2.getGetCounter();
        //console.log("increaseReultAfter ",increaseReultAfter);

        // increaseBy is 25 and the counter is 1, 1 * 25 < 255 so it should pass
        expect(increaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: overflowTest2.address,
            success: true,
        });
    });
});
