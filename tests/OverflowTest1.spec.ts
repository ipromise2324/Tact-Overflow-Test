import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { OverflowTest1 } from '../wrappers/OverflowTest1';
import '@ton/test-utils';

describe('OverflowTest1', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let overflowTest1: SandboxContract<OverflowTest1>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        overflowTest1 = blockchain.openContract(await OverflowTest1.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await overflowTest1.send(
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
            to: overflowTest1.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and overflowTest1 are ready to use
    });

    it('should not increase counter when overflow', async () => {
        let increaseBy = 256n;
        const increaseResult = await overflowTest1.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Mul',
                amount: increaseBy,
            }
        );

        // increaseBy is 256 and the counter is 1, 1 * 256 > 255 so it should fail
        expect(increaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: overflowTest1.address,
            success: false,
        });
    });

    it('should increase counter', async () => {
        let increaseBy = 25n;
        const increaseReultBefore = await overflowTest1.getGetCounter();
        //console.log("increaseReultBefore ",increaseReultBefore);
        const increaseResult = await overflowTest1.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Mul',
                amount: increaseBy,
            }
        );
        const increaseReultAfter = await overflowTest1.getGetCounter();
        //console.log("increaseReultAfter ",increaseReultAfter);

        // increaseBy is 25 and the counter is 1, 1 * 25 < 255 so it should pass
        expect(increaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: overflowTest1.address,
            success: true,
        });
    });
});
