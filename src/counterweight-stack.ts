import { deepEqual } from "objects-deep-compare";

// Interface for defining counterweight rules
interface CounterweightRule<T> {
  mainElement: T; // The main element that will be at the top of the stack
  counterweights: T[]; // List of elements that can act as a counterweight for mainElement
}

/**
 * Represents a Counterweight Stack data structure.
 * Follows the LIFO (Last-In, First-Out) principle, but popping requires
 * providing a valid "counterweight" element for the element currently at the top.
 * @template T The type of elements the stack will hold. Should support deep equality comparison.
 */
class CounterweightStack<T> {
  private items: T[] = [];
  private rules: CounterweightRule<T>[] = []; // Stores the counterweight rules

  /**
   * Creates an instance of CounterweightStack.
   * @param rules An array of rules defining main elements and their counterweights.
   */
  constructor(rules: CounterweightRule<T>[]) {
    // It's good practice to make a copy to prevent unexpected external modifications
    try {
      this.rules = structuredClone(rules);
    } catch (e) {
      // Fallback to shallow copy if structuredClone is not available or fails
      console.warn("structuredClone failed, using shallow copy for rules. Ensure rules are not modified externally.");
      this.rules = [...rules];
    }
  }

  /**
   * Checks if a given element is a valid counterweight for the main element.
   * @param main The element considered as the main element (potentially the top of the stack).
   * @param potentialCounterweight The element to check as a counterweight.
   * @returns true if it's a valid counterweight according to the rules, false otherwise.
   */
  private isValidCounterweight(main: T, potentialCounterweight: T): boolean {
    // Find the rule where the mainElement matches the provided 'main' element
    const rule = this.rules.find((r) => deepEqual(r.mainElement, main));

    if (!rule) {
      // If there's no rule for this element as a 'mainElement', it cannot be counterweighted
      return false;
    }

    // Check if 'potentialCounterweight' is in the list of counterweights for the found rule
    return rule.counterweights.some((cw) => deepEqual(cw, potentialCounterweight));
  }

  /**
   * Adds an element to the top of the stack.
   * @param item The element to add.
   */
  push(item: T): void {
    this.items.push(item);
  }

  /**
   * Removes and returns the element from the top of the stack *only if*
   * the provided 'counterweightAttempt' is a valid counterweight for the top element
   * according to the rules defined in the constructor.
   *
   * @param counterweightAttempt The element proposed as a counterweight.
   * @returns The top element if successfully popped (removed), or undefined if the stack
   * is empty or if the 'counterweightAttempt' is not valid for the current top element.
   */
  pop(counterweightAttempt: T): T | undefined {
    if (this.isEmpty()) {
      return undefined; // Cannot pop from an empty stack
    }

    const topElement = this.peek(); // Get the top element without removing it

    // peek() returns undefined if empty, but we already checked that.
    // Add a check just in case T could be undefined.
    if (topElement === undefined) {
      return undefined;
    }

    // Check if the 'counterweightAttempt' is valid for the 'topElement'
    if (this.isValidCounterweight(topElement, counterweightAttempt)) {
      // If valid, actually remove and return the top element
      return this.items.pop();
    } else {
      // If not valid, do nothing and return undefined (indicating failure)
      return undefined;
    }
  }

  /**
   * Returns the element at the top of the stack without removing it.
   * @returns The top element, or undefined if the stack is empty.
   */
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.items.length - 1];
  }

  /**
   * Checks if the stack is empty.
   * @returns true if the stack has no elements, false otherwise.
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Returns the number of elements in the stack.
   * @returns The size of the stack.
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Clears the stack, removing all its elements.
   */
  clear(): void {
    this.items = [];
    // Rules are kept, only items are cleared.
  }

  /**
   * (Optional - same as in your original Stack)
   * Compares an object with the element at the top of the stack using deep equality.
   * @param item The element to compare.
   * @returns true if the stack is not empty and the top element is deep equal to the item, false otherwise.
   */
  compareTop(item: T): boolean {
    if (this.isEmpty()) {
      return false;
    }
    // Use peek() to get the top element safely
    return deepEqual(this.peek(), item);
  }
}

// Export the class if you plan to use it in other modules
export { CounterweightStack, CounterweightRule };
