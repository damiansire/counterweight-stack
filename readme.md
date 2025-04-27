# Counterweight Stack

[![NPM Version](https://img.shields.io/npm/v/counterweight-stack.svg)](https://www.npmjs.com/package/counterweight-stack)
[![License: ISC](https://img.shields.io/npm/l/counterweight-stack.svg)](https://opensource.org/licenses/ISC)
A specialized LIFO (Last-In, First-Out) stack implementation in TypeScript where popping an element requires providing a specific "counterweight" element, defined by user-provided rules.

## Description

This data structure behaves like a standard stack for `push` operations. However, the `pop` operation is conditional: it only succeeds if the provided element is a valid "counterweight" for the element currently at the top of the stack, according to a set of rules defined during instantiation.

This is useful in scenarios like parsing structured text (e.g., matching `begin` with `end`), managing UI states, or any situation where removing an item depends on a specific related item.

## Installation

```bash
npm install counterweight-stack
```

## Usage

```typescript
import { CounterweightStack, CounterweightRule } from "counterweight-stack";

// 1. Define the type of elements your stack will hold
interface Token {
  type: string;
  value: string;
}

// 2. Define the specific elements
const beginToken: Token = { type: "KEYWORD", value: "begin" };
const endToken: Token = { type: "KEYWORD", value: "end" };
const endDotToken: Token = { type: "KEYWORD", value: "end." };
const ifToken: Token = { type: "KEYWORD", value: "if" };
const thenToken: Token = { type: "KEYWORD", value: "then" };
const someOtherToken: Token = { type: "IDENTIFIER", value: "myVar" };

// 3. Define the counterweight rules
const myRules: CounterweightRule<Token>[] = [
  {
    mainElement: beginToken, // If the top is 'begin'
    counterweights: [endToken, endDotToken], // It can be popped with 'end' or 'end.'
  },
  {
    mainElement: ifToken, // If the top is 'if'
    counterweights: [thenToken], // It can be popped with 'then'
  },
];

// 4. Create the stack instance
const stack = new CounterweightStack<Token>(myRules);

// 5. Use the stack operations
stack.push(beginToken);
console.log(stack.peek()); // Output: { type: 'KEYWORD', value: 'begin' }
console.log(stack.size()); // Output: 1

stack.push(ifToken);
console.log(stack.peek()); // Output: { type: 'KEYWORD', value: 'if' }
console.log(stack.size()); // Output: 2

// Attempt to pop 'if' with an incorrect counterweight
let popped = stack.pop(beginToken);
console.log(popped); // Output: undefined (pop failed)
console.log(stack.peek()); // Output: { type: 'KEYWORD', value: 'if' } (still on top)

// Attempt to pop 'if' with the correct counterweight ('then')
popped = stack.pop(thenToken);
console.log(popped); // Output: { type: 'KEYWORD', value: 'if' } (pop succeeded)
console.log(stack.peek()); // Output: { type: 'KEYWORD', value: 'begin' }
console.log(stack.size()); // Output: 1

// Attempt to pop 'begin' with a valid counterweight ('end')
popped = stack.pop(endToken);
console.log(popped); // Output: { type: 'KEYWORD', value: 'begin' }
console.log(stack.isEmpty()); // Output: true
```

## API

### `CounterweightStack<T>(rules: CounterweightRule<T>[])`

- **Constructor:** Creates a new stack instance.
- `rules`: An array of `CounterweightRule` objects defining the pop conditions. A deep copy of the rules is stored internally.

### `CounterweightRule<T>`

- **Interface:** Defines the structure for a rule.
- `mainElement: T`: The element that must be on top for this rule to apply.
- `counterweights: T[]`: An array of elements that can successfully pop the `mainElement`.

### Methods

- **`push(item: T): void`**: Adds an element to the top of the stack.
- **`pop(counterweightAttempt: T): T | undefined`**: Attempts to remove the top element. Succeeds and returns the element only if `counterweightAttempt` is a valid counterweight for the top element according to the rules. Returns `undefined` if the stack is empty or the counterweight is invalid.
- **`peek(): T | undefined`**: Returns the top element without removing it, or `undefined` if the stack is empty.
- **`isEmpty(): boolean`**: Returns `true` if the stack contains no elements, `false` otherwise.
- **`size(): number`**: Returns the number of elements currently in the stack.
- **`clear(): void`**: Removes all elements from the stack. The rules remain.
- **`compareTop(item: T): boolean`**: (Optional method) Compares the provided item with the top element using deep equality. Returns `false` if the stack is empty.

## Development

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/damiansire/counterweight-stack.git](https://github.com/damiansire/counterweight-stack.git)
    cd counterweight-stack
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run tests:**

    ```bash
    npm test
    ```

4.  **Build:** (Compiles TypeScript to JavaScript in `dist/`)
    ```bash
    npm run build
    ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
