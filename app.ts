interface Printable {
    toString(): string
}

interface Product extends Printable {

}

function print(obj:Printable) {
    console.log(obj.toString())
}

class Apple implements Product {
    public toString = () => {
        return `🍎`
    }
}

class Chicken implements Product {
    public toString = () => {
        return `🍎`
    }
}

class Refrigerator {
    items: Product[]

    constructor() {
        this.items = []
    }
}

print(new Chicken())