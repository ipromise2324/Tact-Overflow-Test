import "@stdlib/deploy";
import "./imports/stdlib-ext.fc";

@name(check_fits_u7)
extends native checkU7(self: Int): Int;

@name(add)
extends native add(self: Int, y: Int): Int;

@name(sub)
extends native sub(self: Int, y: Int): Int;

@name(mul)
extends native mul(self: Int, y: Int): Int;

@name(mul_div)
extends native mul_div(self: Int, y: Int, z: Int): Int;

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
    counter: Int as uint8;
    money: Int as coins;
    init() {
        self.counter = 1;
        self.money = 0;
    }

    receive(msg: Mul) {
        self.counter = self.counter.mul(msg.amount); 
    }

    receive(msg: Div) {
        self.money = self.money.mul_div(self.FP100, msg.amount);
    }

    receive(msg: Add) {
        self.counter = self.counter.add(msg.amount); 
    }

    receive(msg: Sub) {
        self.counter = self.counter.sub(msg.amount); 
    }

    receive(msg: Set) {
        self.money = msg.amount;
    }

    fun encode(x: Int): Int {
        return x * self.FP100;
    }

    fun div(encodeX: Int, y: Int): Int {
        return encodeX / y;
    }

    get fun getCounter(): Int {
        return self.counter;
    }

    get fun getMoney(): Int {
        return self.money;
    }

}
