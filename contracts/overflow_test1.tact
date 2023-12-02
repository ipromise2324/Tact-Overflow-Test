import "@stdlib/deploy";
message Mul {
    amount: Int;
}
contract OverflowTest1 with Deployable {
    counter: Int as uint8;

    init() {
        self.counter = 1;
    }

    receive(msg: Mul) {
        let amount: Int = msg.amount;
        self.counter = (self.counter * amount);
    }

    get fun getCounter(): Int {
        return self.counter;
    }

    
}
