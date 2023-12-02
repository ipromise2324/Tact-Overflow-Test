import "@stdlib/deploy";
import "./imports/stdlib-ext.fc";

@name(check_fits_u7)
extends native checkU7(self: Int): Int;
message Mul {
    amount: Int;
}

contract OverflowTest2 with Deployable {
    counter: Int as uint8;

    init() {
        self.counter = 1;
    }

    receive(msg: Mul) {
        let amount: Int = msg.amount.checkU7();
        self.counter = (self.counter * amount).checkU7();
    }

    get fun getCounter(): Int {
        return self.counter;
    }

}
