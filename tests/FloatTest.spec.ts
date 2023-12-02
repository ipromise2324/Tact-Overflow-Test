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

    it('should add successfully', async () => {

        const counterBefore = await floatTest.getGetCounter();
        //console.log('counterBefore', counterBefore);
        let increaseBy = 25n;
        const increaseResult = await floatTest.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Add',
                amount: increaseBy,
            }
        );

        const counterAfter = await floatTest.getGetCounter();
        //console.log('counterAfter', counterAfter);
        // increaseBy is 255 and the counter is 1, 1 + 255 > 255 so it should fail
        expect(increaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: floatTest.address,
            success: true,
        });

        expect(counterAfter).toEqual(counterBefore + increaseBy);
    });


    it('should add and detect overflow', async () => {

        const counterBefore = await floatTest.getGetCounter();
        //console.log('counterBefore', counterBefore);
        let increaseBy = 255n;
        const increaseResult = await floatTest.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Add',
                amount: increaseBy,
            }
        );

        const counterAfter = await floatTest.getGetCounter();
        //console.log('counterAfter', counterAfter);
        // increaseBy is 255 and the counter is 1, 1 + 255 > 255 so it should fail
        expect(increaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: floatTest.address,
            success: false,
        });
    });

    it('should add successfully', async () => {

        const counterBefore = await floatTest.getGetCounter();
        // console.log('counterBefore', counterBefore);
        let increaseBy = 25n;
        const increaseResult = await floatTest.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Add',
                amount: increaseBy,
            }
        );

        const counterAfter = await floatTest.getGetCounter();
        // console.log('counterAfter', counterAfter);
        // increaseBy is 255 and the counter is 1, 1 + 255 > 255 so it should fail
        expect(increaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: floatTest.address,
            success: true,
        });

        expect(counterAfter).toEqual(counterBefore + increaseBy);
    });


    it('should sub and detect underflow', async () => {

        const counterBefore = await floatTest.getGetCounter();
        //console.log('counterBefore', counterBefore);
        let decreaseBy = 10n;
        const decreaseResult = await floatTest.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Sub',
                amount: decreaseBy,
            }
        );

        const counterAfter = await floatTest.getGetCounter();
        //console.log('counterAfter', counterAfter);
        // decreaseBy is 10 and the counter is 1, 1 - 10 < 0, so it should fail
        expect(decreaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: floatTest.address,
            success: false,
        });
        
    });

    it('should sub and detect underflow', async () => {

        const counterBefore = await floatTest.getGetCounter();
        //console.log('counterBefore', counterBefore);
        let decreaseBy = 1n;
        const decreaseResult = await floatTest.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Sub',
                amount: decreaseBy,
            }
        );

        const counterAfter = await floatTest.getGetCounter();
        //console.log('counterAfter', counterAfter);
        // decreaseBy is 10 and the counter is 1, 1 - 10 < 0, so it should fail
        expect(decreaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: floatTest.address,
            success: true,
        });

        expect(counterAfter).toEqual(counterBefore - decreaseBy);
    });

    it('should mul and detect oversflow', async () => {
        let increaseBy = 256n;
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

        // increaseBy is 256 and the counter is 1, 1 * 256 > 255 so it should fail
        expect(increaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: floatTest.address,
            success: false,
        });
    });

    it('should mul successfully', async () => {
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

        expect(increaseReultAfter).toEqual(increaseReultBefore * increaseBy);
    });

    it('should div successfully', async () => {
        const setAmount = 1200;
        const setResult = await floatTest.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Set',
                amount: toNano(setAmount),
            }
        );
        expect(setResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: floatTest.address,
            success: true,
        });
        const divAmount = 3.33;
        const divBy = toNano(divAmount); // 15 00000000
        const divReultBefore = await floatTest.getGetMoney();
        console.log("divReultBefore ",divReultBefore);
        const divResult = await floatTest.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Div',
                amount: divBy,
            }
        );
        expect(divResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: floatTest.address,
            success: true,
        });
        const divReultAfter = await floatTest.getGetMoney();
        console.log("divReultAfter ",divReultAfter);
        let tmpResult: string = (setAmount / divAmount).toFixed(9);
        let divAns: number = parseFloat(tmpResult); 
        expect((Number(divReultAfter)/1000000000)).toEqual(divAns);

    });
});
