// --- Example Usage ---

import { CounterweightRule, CounterweightStack } from "./counterweight-stack";

// (Optional but recommended) Define an interface for the structure of your elements
interface StackElement {
  type: string;
  value: string;
  // You can add more properties if needed
}

// 1. Define your element type (using the interface or directly)
type Token = StackElement; // Alias for clarity

// 2. Define the specific elements you will use
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
  // You can add more rules here
];

// 4. Create the stack instance with the rules
const counterStack = new CounterweightStack<Token>(myRules);

// 5. Use the stack
counterStack.push(beginToken);
console.log("Stack after push(begin):", counterStack.size(), counterStack.peek()); // Size: 1, Peek: { type: 'KEYWORD', value: 'begin' }

counterStack.push(ifToken);
console.log("Stack after push(if):", counterStack.size(), counterStack.peek()); // Size: 2, Peek: { type: 'KEYWORD', value: 'if' }

// Try to pop 'if' with an incorrect counterweight
let poppedItem = counterStack.pop(beginToken);
console.log("Attempt pop(begin):", poppedItem); // undefined (failed)
console.log("Stack after failed pop:", counterStack.size(), counterStack.peek()); // Size: 2, Peek: { type: 'KEYWORD', value: 'if' }

// Try to pop 'if' with the correct counterweight ('then')
poppedItem = counterStack.pop(thenToken);
console.log("Attempt pop(then):", poppedItem); // { type: 'KEYWORD', value: 'if' } (success)
console.log("Stack after successful pop:", counterStack.size(), counterStack.peek()); // Size: 1, Peek: { type: 'KEYWORD', value: 'begin' }

// Add an element that is not a 'main' element in any rule
counterStack.push(someOtherToken);
console.log("Stack after push(someOtherToken):", counterStack.size(), counterStack.peek()); // Size: 2, Peek: { type: 'IDENTIFIER', value: 'myVar' }

// Try to pop 'someOtherToken'. It has no rule as a 'mainElement', so it will fail.
poppedItem = counterStack.pop(endToken); // Any attempt will fail
console.log("Attempt pop(end) on 'someOtherToken':", poppedItem); // undefined (failed)
console.log("Stack remains:", counterStack.size(), counterStack.peek()); // Size: 2, Peek: { type: 'IDENTIFIER', value: 'myVar' }
// To remove 'someOtherToken', you would need a "normal" pop or a specific rule. This implementation does *not* allow it.
// If you wanted to allow removing elements without rules via a special pop, the class would need modification.

// Now, try to pop 'begin' with a valid counterweight (but 'someOtherToken' is on top!)
poppedItem = counterStack.pop(endDotToken);
console.log("Attempt pop(end.) with other token on top:", poppedItem); // undefined (failed because 'someOtherToken' is on top and has no rule for 'end.')
console.log("Stack still unchanged:", counterStack.size(), counterStack.peek()); // Size: 2, Peek: { type: 'IDENTIFIER', value: 'myVar' }

// --- Clean Example Restart ---
console.log("\n--- Restarting Clean Example ---");
const cleanStack = new CounterweightStack<Token>(myRules);
cleanStack.push(beginToken);
cleanStack.push(ifToken); // Top: if, Bottom: begin

console.log("Initial stack:", cleanStack.size(), cleanStack.peek()); // Size: 2, Peek: if

let cleanPopped = cleanStack.pop(thenToken); // Pop 'if' using 'then'
console.log("Pop 'if' with 'then':", cleanPopped); // { type: 'KEYWORD', value: 'if' }
console.log("Stack now:", cleanStack.size(), cleanStack.peek()); // Size: 1, Peek: begin

cleanPopped = cleanStack.pop(endToken); // Pop 'begin' using 'end'
console.log("Pop 'begin' with 'end':", cleanPopped); // { type: 'KEYWORD', value: 'begin' }
console.log("Final stack:", cleanStack.size(), cleanStack.peek()); // Size: 0, Peek: undefined
console.log("Is empty?:", cleanStack.isEmpty()); // true
