interface Printable {
    toString(): string
}

function print(obj:Printable) {
    console.log(obj.toString())
}

class Apple {
    public toString = () => {
        return `🍎`;
    }
}

class Chicken {
    public toString = () => {
        return `🍎`;
    }
}

print(new Chicken())