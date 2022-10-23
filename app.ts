/*--- Printables ---*/

interface Printable {
    toString(): string
}

function isPrintable(obj: any): obj is Printable {
    return obj === null || typeof obj === 'string' ? false : 'toString' in obj
}

function toString(obj:Printable | string | null) {
    return isPrintable(obj) ? obj.toString() : obj
}

function print(obj:Printable | string | null) {
    console.log(toString(obj))
}

/*--- Product ---*/

enum ProductState { good = 'хороший', bad = 'испорченный', fried = 'жареный', boiled = 'варёный', steamed = 'тушёный' };

interface Friable {
    fry(): void
}

interface Boilable {
    boil(): void
}

interface Steamable {
    steam(): void
}

class Product implements Printable, Friable, Boilable, Steamable {
    name: string
    icon: string
    state: ProductState

    constructor(name:string, icon:string) {
        this.name = name
        this.icon = icon
        this.state = ProductState.good
    }

    public toString = () => {
        return `${this.icon}:${this.name}:${this.state}`
    }

    fry(): Product {
        this.state = ProductState.bad
        return this
    }

    boil(): Product {
        this.state = ProductState.bad
        return this
    }

    steam(): Product {
        this.state = ProductState.bad
        return this
    }
}

/*--- Concreeete products---*/

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

    fry() {
        this.state =ProductState.fried
        return this
    }

    boil() {
        this.state = ProductState.boiled
        return this
    }

    steam() {
        this.state = ProductState.steamed
        return this
    }
}

class Bread extends Product {
    constructor() {
        super('хлеб', '🍞')
    }

    fry() {
        this.state = ProductState.fried
        return this
    }
}

class Egg extends Product {
    constructor() {
        super('яйцо', '🥚')
    }

    fry() {
        return new Omelete()
    }

    boil() {
        this.state = ProductState.boiled
        return this
    }
}

class Omelete extends Product {
    constructor() {
        super('яишница', '🍳')
    }
}

/*--- Storage ---*/

class TheStorage implements Printable {
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
        let found = this.items.find(x => x.name == name) 
        if (found) {
            this.items = this.items.filter(x => x != found)
            return found
        } else {
            return noProduct
        }
    }

    public peek(name:string) {
        let found = this.items.find(x => x.name == name) 
        if (found) {
            return found.toString()
        } else {
            return null
        }
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

    peek(name:string) {
        let normal = super.peek(name)
        return normal ? normal : this.freezer.peek(name)
    }

    toString() {
        return `холодильник:[${this.items.map(x => toString(x))}], морозильик:[${this.freezer.items.map(x => toString(x))}]`
    }
}

class Shelves extends TheStorage {
    toString() {
        return `[полки:${this.items.map(x => toString(x))}]`
    }
}

class Freezer extends TheStorage {
    toString() {
        return `[морозильик:${this.items.map(x => toString(x))}]`
    }
}

/*--- Stove ---*/

class Stove {
    fry(obj:Product) {
        return obj.fry()
    }

    boil(obj:Product) {
        return obj.boil()
    }

    steam(obj:Product) {
        return obj.steam()
    }
}

/*--- Action ---*/

let chicken = new Chicken()
let apple = new Apple()
let egg = new Egg()
let refrigerator = new Refrigerator(10, 2)
let stove = new Stove()

refrigerator.addToFreezer(chicken)
refrigerator.add(apple)

print(refrigerator)

chicken = stove.fry(refrigerator.pull('кура'))
egg = stove.fry(egg)

print(refrigerator.peek('яблоко'))
print(refrigerator.peek('тыква'))
print(refrigerator.peek('кура'))

print(chicken)
print(egg)

refrigerator.addToFreezer(chicken)

print(refrigerator)