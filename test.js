const obj = {0: true, 1: true, 2: false, 3: false,4: true};
const f = on => !on;
console.log (
    Object.fromEntries(
        Object.entries(obj).map(
            ([day, on]) => [day, (on => !on)(on)]
        )
    )
)
// What???
