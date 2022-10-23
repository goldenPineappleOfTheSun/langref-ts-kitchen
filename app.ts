interface Printable {
    toString(): string
}

interface Product extends Printable {
    name: string
}

function print(obj:Printable) {
    console.log(obj.toString())
}

class NoProduct implements Product {
    name: string

    constructor() {
        this.name = 'нет'
    }

    public toString = () => {
        return `🚫`
    }
}
const noProduct = new NoProduct()

class Apple implements Product {
    name: string

    constructor() {
        this.name = 'яблоко'
    }

    public toString = () => {
        return `🍎`
    }
}

class Chicken implements Product {
    name: string

    constructor() {
        this.name = 'кура'
    }

    public toString = () => {
        return `🍗`
    }
}

class TheStorage {
    items: Product[]
    capacity: number

    constructor(capacity: number) {
        this.items = []
        this.capacity = capacity
    }

    public add(product: Product) {
        if (this.items.length < this.capacity) {
            this.items.push(product)
        }
    }

    public pull(name:string) {
        return this.items.find(x => x.name == name) || noProduct
    }
}

class Refrigerator extends TheStorage {
    freezer: Freezer
    
    constructor(capacity:number, freezerCapacity:number) {
        super(capacity)
        this.freezer = new Freezer(freezerCapacity)
    }

    addToFreezer(product:Product) {
        this.freezer.add(product)
    }

    pull(name:string) {
        let normal = super.pull(name)
        return normal != noProduct ? normal : this.freezer.pull(name)
    }
}

class Shelves extends TheStorage {
    
}

class Freezer extends TheStorage {
    
}

let chicken = new Chicken()
let apple = new Apple()
let refrigerator = new Refrigerator(10, 2)

refrigerator.addToFreezer(chicken)
refrigerator.add(apple)

print(refrigerator.pull('яблоко'))
print(refrigerator.pull('тыква'))
print(refrigerator.pull('кура'))