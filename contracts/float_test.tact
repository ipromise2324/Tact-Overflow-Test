import "@stdlib/deploy";
import "./imports/stdlib-ext.fc";
@name(check_fits_u8)
extends native checkU8(self: Int): Int;


message Mul {
    amount: Int;
}

contract FloatTest with Deployable {
    counter: Int as uint8;

    init() {
        self.counter = 1;
    }

    receive(msg: Mul) {
        let amount: Int = msg.amount.checkU8();
        self.counter = (self.counter * amount).checkU8();
    }

    get fun getCounter(): Int {
        return self.counter;
    }

}
