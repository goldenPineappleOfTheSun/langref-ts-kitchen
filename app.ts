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

enum ProductState { good = 'хороший', bad = 'испорченный', used = '-', fried = 'жареный', boiled = 'варёный', steamed = 'тушёный' };

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

    constructor(name:string, icon:string, state = ProductState.good) {
        this.name = name
        this.icon = icon
        this.state = state
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
        super('нет', '🚫', ProductState.used)
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

class Sandwich extends Product {
    constructor() {
        super('бутерброд', '🥪')
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
        if (product.state === ProductState.used) {
            return   
        }
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
        return obj.state == ProductState.used ? obj : obj.fry()
    }

    boil(obj:Product) {
        return obj.state == ProductState.used ? obj : obj.boil()
    }

    steam(obj:Product) {
        return obj.state == ProductState.used ? obj : obj.steam()
    }
}

/*--- Receipts ---*/

type ReceiptsCollection = {
    [key:string]: Receipt
}

class Receipt {
    constituents: Array<[string, ProductState]>
    result: { new(): Product }

    constructor(parts: Array<[string, ProductState]>, result:{ new(): Product }) {
        this.constituents = parts
        this.result = result
    }
}

const bookOfReceipts: ReceiptsCollection = {
    'бутерброд': new Receipt([['хлеб', ProductState.good], ['кура', ProductState.fried]], Sandwich)
}

function mix(receipts:ReceiptsCollection, input: Product[]): Product {
    for (let k in receipts) {
        const r = receipts[k]
        let matchCount = 0
        for (let a of r.constituents) {
            let found = false
            for (let b of input) {
                if (b.name == a[0] && b.state == a[1]) {
                    found = true
                    break
                }
            }
            if (found) {
                matchCount += 1
            }
        }

        if (matchCount == r.constituents.length) {
            for (let p of input) {
                p.state = ProductState.used
            }
            return new r.result()
        }
    }
    return noProduct
}

/*--- Action ---*/

let chicken = new Chicken()
let bread = new Bread()
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

print(mix(bookOfReceipts, [chicken, bread]))
print(mix(bookOfReceipts, [apple, bread]))

print(refrigerator)
refrigerator.add(bread)
print(bread)
print(refrigerator)
