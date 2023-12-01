import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { FloatTest } from '../wrappers/FloatTest';
import '@ton/test-utils';

describe('FloatTest', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let floatTest: SandboxContract<FloatTest>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        floatTest = blockchain.openContract(await FloatTest.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await floatTest.send(
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
            to: floatTest.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and floatTest are ready to use
    });

    it('should not increase counter when overflow', async () => {
        let increaseBy = 255n;
        const increaseReultBefore = await floatTest.getGetCounter();
        //console.log("increaseReultBefore ",increaseReultBefore);
        const increaseResult = await floatTest.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Mul',
                amount: increaseBy,
            }
        );
        const increaseReultAfter = await floatTest.getGetCounter();
        //console.log("increaseReultAfter ",increaseReultAfter);

        // increaseBy is 258 and the counter is 1, 1 * 258 >= 255 so it should fail
        expect(increaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: floatTest.address,
            success: false,
        });
    });

    it('should increase counter', async () => {
        let increaseBy = 25n;
        const increaseReultBefore = await floatTest.getGetCounter();
        //console.log("increaseReultBefore ",increaseReultBefore);
        const increaseResult = await floatTest.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Mul',
                amount: increaseBy,
            }
        );
        const increaseReultAfter = await floatTest.getGetCounter();
        //console.log("increaseReultAfter ",increaseReultAfter);

        // increaseBy is 25 and the counter is 1, 1 * 25 < 255 so it should pass
        expect(increaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: floatTest.address,
            success: true,
        });
    });

});
