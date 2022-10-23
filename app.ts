interface Printable {
    toString(): string
}

class Product implements Printable {
    name: string
    icon: string

    constructor(name:string, icon:string) {
        this.name = name
        this.icon = icon
    }

    public toString = () => {
        return `${this.icon}:${this.name}:хороший`
    }
}

function print(obj:Printable) {
    console.log(obj.toString())
}

class NoProduct extends Product {
    constructor() {
        super('нет', '🚫')
    }
}
const noProduct = new NoProduct()

class Apple extends Product {
    constructor() {
        super('яблоко', '🍎')
    }
}

class Chicken extends Product {
    constructor() {
        super('кура', '🍗')
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