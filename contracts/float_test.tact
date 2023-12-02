import "@stdlib/deploy";
import "./imports/stdlib-ext.fc";

@name(check_fits_u7)
extends native checkU7(self: Int): Int;

@name(add)
extends native add(self: Int, y: Int): Int;

@name(sub)
extends native sub(self: Int, y: Int): Int;

@name(safe_mul)
extends native safe_mul(self: Int, y: Int, z: Int): Int;

@name(safe_div)
extends native safe_div(self: Int, y: Int, z: Int): Int;

message Mul {
    amount: Int;
}

message Div {
    amount: Int as coins;
}

message Add {
    amount: Int;
}

message Sub {
    amount: Int;
}

message Set {
    amount: Int as coins;
}
contract FloatTest with Deployable {
    const FP100: Int = pow(10, 9);
    counter: Int as coins;
    init() {
        self.counter = 1;
    }

    receive(msg: Mul) {
        self.counter = self.counter.safe_mul(msg.amount, self.FP100); 
    }

    receive(msg: Div) {
        self.counter = self.counter.safe_div(self.FP100, msg.amount);
    }

    receive(msg: Add) {
        self.counter = self.counter.add(msg.amount); 
    }

    receive(msg: Sub) {
        self.counter = self.counter.sub(msg.amount); 
    }

    receive(msg: Set) {
        self.counter = msg.amount;
    }

    get fun getCounter(): Int {
        return self.counter;
    }

}
