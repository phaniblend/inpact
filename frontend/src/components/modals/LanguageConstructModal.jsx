import React from 'react';
import BaseModal from './BaseModal';

export default function LanguageConstructModal({ isOpen, onClose, construct, language, explainedConcepts = new Set(), onConceptExplained }) {
  const scrollContainerRef = React.useRef(null);

  // Auto-scroll to top when construct changes
  React.useLayoutEffect(() => {
    if (isOpen && construct && scrollContainerRef.current) {
      // Immediate scroll
      scrollContainerRef.current.scrollTop = 0;
      // Backup scroll after a tiny delay to catch any late renders
      const timeoutId = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0;
        }
      }, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [construct, isOpen]);

  if (!isOpen || !construct) return null;

  const languageInfo = {
    javascript: { name: 'JavaScript', emoji: '💛' },
    python: { name: 'Python', emoji: '🐍' },
    java: { name: 'Java', emoji: '☕' },
    cpp: { name: 'C++', emoji: '⚡' },
    typescript: { name: 'TypeScript', emoji: '💙' }
  };

  const lang = languageInfo[language] || languageInfo.javascript;

  // Function to detect and explain new keywords/concepts in code
  const detectNewConcepts = (code, lang) => {
    const concepts = [];
    
    if (lang === 'javascript' || lang === 'typescript') {
      const conceptKey = `${lang}-console.log`;
      if (code.includes('console.log') && !explainedConcepts.has(conceptKey)) {
        concepts.push({
          keyword: 'console.log',
          key: conceptKey,
          explanation: `You might have noticed that I've used a new keyword called \`console.log\` in the code example. You might wonder what it's doing and what \`console\` is.\n\nThe \`console\` is a built-in object in JavaScript that provides access to the browser's debugging console. Think of it as a display board where JavaScript can print output when asked. The \`.log()\` method is a function attached to the \`console\` object that prints (or "logs") information to the console.\n\nWhen you write \`console.log(something)\`, you're telling JavaScript: "Take this value and display it in the browser's console so I can see it." This is extremely useful for debugging and seeing what your code is doing.\n\nTo see the output, open your browser's Developer Tools (press F12) and look at the Console tab.`
        });
      }
      if (code.includes('console.') && !code.includes('console.log')) {
        concepts.push({
          keyword: 'console',
          explanation: `You might have noticed the \`console\` keyword in the code. The \`console\` is a built-in JavaScript object that provides access to the browser's debugging console. It's like a display board where you can print output. Common methods include \`console.log()\` for printing messages, \`console.error()\` for errors, and \`console.warn()\` for warnings.`
        });
      }
    }
    
    if (lang === 'python') {
      const printKey = `${lang}-print()`;
      if (code.includes('print(') && !explainedConcepts.has(printKey)) {
        concepts.push({
          keyword: 'print()',
          key: printKey,
          explanation: `You might have noticed that I've used \`print()\` in the code example. \`print()\` is a built-in Python function that displays output to the console or terminal.\n\nWhen you write \`print(something)\`, Python takes that value and displays it on the screen. This is how you see the results of your code. For example, \`print("Hello")\` will display "Hello" on your screen. It's one of the most commonly used functions in Python for seeing what your code is doing.`
        });
      }
    }
    
    if (lang === 'java') {
      const printlnKey = `${lang}-System.out.println`;
      if (code.includes('System.out.println') && !explainedConcepts.has(printlnKey)) {
        concepts.push({
          keyword: 'System.out.println',
          key: printlnKey,
          explanation: `You might have noticed that I've used \`System.out.println()\` in the code example. This might look complex, but let's break it down:\n\n- \`System\` is a built-in Java class that provides access to system resources\n- \`out\` is a static field in the System class that represents the standard output stream (your console/terminal)\n- \`println\` is a method that prints a line of text and then moves to the next line\n\nSo \`System.out.println(something)\` means: "Take this value and print it to the console, then go to the next line." This is how you display output in Java programs.`
        });
      }
    }
    
    if (lang === 'cpp') {
      const coutKey = `${lang}-cout`;
      if (code.includes('cout') && !explainedConcepts.has(coutKey)) {
        concepts.push({
          keyword: 'cout',
          key: coutKey,
          explanation: `You might have noticed that I've used \`cout\` in the code example. \`cout\` (pronounced "see-out") is a C++ object that represents the standard output stream - essentially, your console or terminal.\n\nWhen you write \`cout << something\`, you're using the stream insertion operator \`<<\` to send data to the output stream. Think of it like saying "send this to the screen." The \`<<\` operator works like a funnel, directing data from your program to the console where you can see it.\n\nYou'll also need \`#include <iostream>\` at the top of your file to use \`cout\`, and \`using namespace std;\` or \`std::cout\` to access it.`
        });
      }
      const endlKey = `${lang}-endl`;
      if (code.includes('endl') && !explainedConcepts.has(endlKey)) {
        concepts.push({
          keyword: 'endl',
          key: endlKey,
          explanation: `You might have noticed \`endl\` in the code. \`endl\` stands for "end line" and is used with \`cout\` to print a newline character (move to the next line) and flush the output buffer. It's equivalent to pressing Enter. You can also use \`\\n\` for a simpler newline.`
        });
      }
    }
    
    return concepts;
  };

  const constructExplanations = {
    variables: {
      title: 'Variables - Containers for Values',
      context: `In programming, we often need to store values so we can reuse them. Think of variables like labeled boxes where you can put things and refer to them by name.

For example, if you want to add two numbers, you don't just say "add 5 and 7" every time. Instead, you create containers called variables that can hold different numbers, making your code reusable and flexible.`,
      syntax: {
        javascript: `In JavaScript, we create these containers using keywords like \`let\`, \`const\`, or \`var\`:

\`\`\`javascript
let num1 = 5;  // "let" tells JavaScript: "Create a container named num1 that holds the value 5"
let num2 = 7;  // Another container named num2 holding 7
let sum = num1 + num2;  // We can use these containers to perform operations

// The name (num1, num2) is just a label for our convenience - we could call it anything!
let myNumber = 10;
let price = 25.99;
\`\`\`

- \`let\` - Creates a variable that can be changed later
- \`const\` - Creates a variable that cannot be changed (constant)
- \`var\` - Older way (still works, but \`let\` is preferred)`,
        python: `In Python, we create variables simply by assigning values:

\`\`\`python
num1 = 5  # Python automatically creates a container named num1 holding 5
num2 = 7  # Another container named num2 holding 7
sum = num1 + num2  # Use these containers to perform operations

# The name is just a label - we could call it anything!
my_number = 10
price = 25.99
\`\`\`

Python is smart - it figures out what type of data you're storing (number, text, etc.) automatically!`,
        java: `In Java, we must specify the type of data the container will hold:

\`\`\`java
int num1 = 5;  // "int" means integer (whole number), num1 is the container name
int num2 = 7;  // Another integer container
int sum = num1 + num2;  // Use containers to perform operations

// Java requires you to declare the type before using the variable
double price = 25.99;  // "double" means decimal number
String name = "John";  // "String" means text
\`\`\`

Java is strict - you must tell it exactly what type of data each container holds!`,
        cpp: `In C++, we also specify the type of data:

\`\`\`cpp
int num1 = 5;  // "int" means integer, num1 is the container name
int num2 = 7;  // Another integer container
int sum = num1 + num2;  // Use containers to perform operations

// C++ requires type declaration
double price = 25.99;  // "double" for decimal numbers
string name = "John";  // "string" for text
\`\`\`

C++ is similar to Java - you must declare the type before using variables!`,
        typescript: `In TypeScript, we can optionally specify types (but it's recommended):

\`\`\`typescript
let num1: number = 5;  // ": number" tells TypeScript this container holds numbers
let num2: number = 7;  // Another number container
let sum: number = num1 + num2;  // Use containers to perform operations

// TypeScript can also infer types automatically
let myNumber = 10;  // TypeScript knows this is a number
let price = 25.99;  // TypeScript knows this is a number
\`\`\`

TypeScript gives you the flexibility of JavaScript with the safety of type checking!`
      }
    },
    arrays: {
      title: 'Arrays - Lists of Values',
      context: `Sometimes you need to store multiple values together, like a shopping list or a list of scores. Arrays are like numbered shelves where each item has a position number (starting from 0).

Think of it like apartment building floors - the first floor is floor 0, second is floor 1, etc. Each "floor" can hold one value, and you access it by its number.`,
      syntax: {
        javascript: `In JavaScript, arrays are created with square brackets:

\`\`\`javascript
let nums = [2, 7, 11, 15];  // Create an array with 4 numbers

// Access elements by their position (index) - remember, counting starts at 0!
nums[0]  // Gets the first element: 2
nums[1]  // Gets the second element: 7
nums[2]  // Gets the third element: 11
nums[3]  // Gets the fourth element: 15

nums.length  // Gets how many items are in the array: 4

// You can change values too
nums[0] = 5;  // Now the first element is 5 instead of 2
\`\`\`

Arrays are super useful when you need to work with multiple values!`,
        python: `In Python, arrays are called "lists" and work similarly:

\`\`\`python
nums = [2, 7, 11, 15]  # Create a list with 4 numbers

# Access elements by index (position) - counting starts at 0!
nums[0]  # Gets the first element: 2
nums[1]  # Gets the second element: 7
nums[2]  # Gets the third element: 11
nums[3]  # Gets the fourth element: 15

len(nums)  # Gets how many items: 4

# You can change values
nums[0] = 5  # Now first element is 5
\`\`\`

Python lists are very flexible - you can mix different types of data too!`,
        java: `In Java, arrays have a fixed size and must specify the type:

\`\`\`java
int[] nums = {2, 7, 11, 15};  // Create array of integers

// Access by index (starts at 0)
nums[0]  // First element: 2
nums[1]  // Second element: 7
nums.length  // Number of elements: 4

// Change values
nums[0] = 5;  // First element becomes 5
\`\`\`

Java arrays are efficient but have a fixed size once created!`,
        cpp: `In C++, arrays work similarly to Java:

\`\`\`cpp
int nums[] = {2, 7, 11, 15};  // Create array
// or
vector<int> nums = {2, 7, 11, 15};  // Using vector (more flexible)

// Access by index
nums[0]  // First element: 2
nums[1]  // Second element: 7

// With vector:
nums.size()  // Number of elements
\`\`\`

C++ gives you both fixed arrays and flexible vectors!`,
        typescript: `In TypeScript, arrays work like JavaScript but with type safety:

\`\`\`typescript
let nums: number[] = [2, 7, 11, 15];  // Array of numbers

// Access by index
nums[0]  // First element: 2
nums[1]  // Second element: 7
nums.length  // Number of elements: 4

// Change values
nums[0] = 5;  // First element becomes 5
\`\`\`

TypeScript arrays are like JavaScript but with type checking!`
      }
    },
    forLoops: {
      title: 'For Loops - Repeating Actions',
      context: `When you need to do something multiple times, like checking each item in a list, you use loops. Instead of writing the same code over and over, loops let you say "do this for each item" once.

Think of it like a teacher checking each student's homework - instead of checking student 1, then student 2, then student 3 separately, you say "for each student, check their homework" and the loop does it automatically.`,
      syntax: {
        javascript: `In JavaScript, for loops let you repeat code:

\`\`\`javascript
let nums = [2, 7, 11, 15];

// This loop says: "Start at 0, go up to nums.length, increase by 1 each time"
for (let i = 0; i < nums.length; i++) {
  console.log(nums[i]);  // Print each number
  // i starts at 0, then becomes 1, then 2, then 3
  // Each time, nums[i] gets a different value from the array
}

// What happens:
// i = 0: prints nums[0] which is 2
// i = 1: prints nums[1] which is 7
// i = 2: prints nums[2] which is 11
// i = 3: prints nums[3] which is 15
// i = 4: stops (because 4 is not < 4)
\`\`\`

Loops save you from writing the same code many times!`,
        python: `In Python, for loops are simpler:

\`\`\`python
nums = [2, 7, 11, 15]

# This loop says: "For each number in nums, do something with it"
for num in nums:
    print(num)  # Print each number
    # Python automatically gives you each value, one at a time

# Or if you need the index:
for i in range(len(nums)):
    print(nums[i])  # Access by index like JavaScript
\`\`\`

Python's for loops are very readable - they read almost like English!`,
        java: `In Java, for loops work like JavaScript:

\`\`\`java
int[] nums = {2, 7, 11, 15};

// Start at 0, continue while i < nums.length, increase i by 1
for (int i = 0; i < nums.length; i++) {
    System.out.println(nums[i]);  // Print each number
}
\`\`\`

Java loops are very similar to JavaScript - same pattern!`,
        cpp: `In C++, for loops are similar:

\`\`\`cpp
int nums[] = {2, 7, 11, 15};

// Same pattern: start, condition, increment
for (int i = 0; i < 4; i++) {
    cout << nums[i] << endl;  // Print each number
}
\`\`\`

C++ loops follow the same pattern as Java and JavaScript!`,
        typescript: `In TypeScript, for loops work exactly like JavaScript:

\`\`\`typescript
let nums: number[] = [2, 7, 11, 15];

// Same pattern as JavaScript
for (let i = 0; i < nums.length; i++) {
    console.log(nums[i]);  // Print each number
}
\`\`\`

TypeScript loops are identical to JavaScript!`
      }
    },
    hashMaps: {
      title: 'Hash Maps - Fast Lookups',
      context: `Sometimes you need to quickly find information by a "key" - like looking up a phone number by someone's name. Hash maps (also called dictionaries or objects) let you store pairs: a key (like a name) and a value (like a phone number).

Think of it like a real dictionary - you look up a word (key) to find its definition (value). Hash maps let you do this lookup instantly, which is much faster than searching through a list!`,
      syntax: {
        javascript: `In JavaScript, you can use objects \`{}\` or \`Map\`:

\`\`\`javascript
// Using objects (most common)
let map = {};  // Empty container for key-value pairs

map[2] = 0;  // Store: key is 2, value is 0 (like "when I see 2, remember it's at position 0")
map[7] = 1;  // Store: key is 7, value is 1

// Check if a key exists
if (2 in map) {  // "Is 2 in our map?"
    console.log(map[2]);  // Get the value: 0
}

// Or using Map (more features)
let myMap = new Map();
myMap.set(2, 0);  // Store key-value pair
myMap.get(2);  // Get value: 0
myMap.has(2);  // Check if exists: true
\`\`\`

Hash maps are perfect when you need to quickly find if you've seen something before!`,
        python: `In Python, hash maps are called "dictionaries":

\`\`\`python
# Create empty dictionary
map = {}

map[2] = 0  # Store: key 2 maps to value 0
map[7] = 1  # Store: key 7 maps to value 1

# Check if key exists
if 2 in map:  # "Is 2 in our dictionary?"
    print(map[2])  # Get value: 0

# Or use .get() method (safer)
value = map.get(2)  # Returns 0 if exists, None if not
\`\`\`

Python dictionaries are very intuitive and powerful!`,
        java: `In Java, use \`HashMap\`:

\`\`\`java
import java.util.HashMap;

HashMap<Integer, Integer> map = new HashMap<>();

map.put(2, 0);  // Store: key 2, value 0
map.put(7, 1);  // Store: key 7, value 1

// Check if key exists
if (map.containsKey(2)) {  // "Does map contain key 2?"
    System.out.println(map.get(2));  // Get value: 0
}
\`\`\`

Java HashMaps are type-safe and efficient!`,
        cpp: `In C++, use \`unordered_map\`:

\`\`\`cpp
#include <unordered_map>

unordered_map<int, int> map;

map[2] = 0;  // Store: key 2, value 0
map[7] = 1;  // Store: key 7, value 1

// Check if key exists
if (map.count(2)) {  // "Does map have key 2?"
    cout << map[2] << endl;  // Get value: 0
}
\`\`\`

C++ unordered_maps are very fast for lookups!`,
        typescript: `In TypeScript, use \`Map\`:

\`\`\`typescript
let map = new Map<number, number>();

map.set(2, 0);  // Store: key 2, value 0
map.set(7, 1);  // Store: key 7, value 1

// Check if key exists
if (map.has(2)) {  // "Does map have key 2?"
    console.log(map.get(2));  // Get value: 0
}
\`\`\`

TypeScript Maps provide type safety with JavaScript flexibility!`
      }
    },
    objects: {
      title: 'Objects - Grouping Related Data',
      context: `Objects let you group related information together. Instead of having separate variables for a person's name, age, and email, you can create one "person" object that contains all that information.

Think of it like a contact card - instead of having "name = John", "age = 25", "email = john@email.com" scattered around, you have one card with all the information organized together.`,
      syntax: {
        javascript: `In JavaScript, objects are created with curly braces:

\`\`\`javascript
// Create an object with properties
let person = {
    name: "John",  // Property "name" has value "John"
    age: 25,       // Property "age" has value 25
    email: "john@email.com"
};

// Access properties
person.name   // Gets "John"
person["age"] // Gets 25 (alternative syntax)

// Change properties
person.age = 26;  // Update age to 26
\`\`\`

Objects help organize related data together!`,
        python: `In Python, dictionaries work as objects:

\`\`\`python
# Create dictionary (works like JavaScript objects)
person = {
    "name": "John",
    "age": 25,
    "email": "john@email.com"
}

# Access properties
person["name"]  # Gets "John"
person.get("age")  # Gets 25

# Change properties
person["age"] = 26  # Update age
\`\`\`

Python dictionaries are very similar to JavaScript objects!`,
        java: `In Java, you'd typically create a class, but for simple cases:

\`\`\`java
// Java uses classes for objects
class Person {
    String name;
    int age;
    String email;
}

Person person = new Person();
person.name = "John";
person.age = 25;
\`\`\`

Java objects are more structured with classes!`,
        cpp: `In C++, similar to Java with classes:

\`\`\`cpp
// C++ uses classes or structs
struct Person {
    string name;
    int age;
    string email;
};

Person person;
person.name = "John";
person.age = 25;
\`\`\`

C++ objects use structs or classes!`,
        typescript: `In TypeScript, objects have types:

\`\`\`typescript
// Define object type
let person: {name: string, age: number, email: string} = {
    name: "John",
    age: 25,
    email: "john@email.com"
};

// Access properties
person.name  // Gets "John"
person.age   // Gets 25
\`\`\`

TypeScript objects have type safety!`
      }
    },
    functions: {
      title: 'Functions - Reusable Code Blocks',
      context: `Functions are like recipes - instead of writing the same cooking steps every time you want to make a dish, you write the recipe once and just say "make pasta" when you need it.

In programming, functions let you write code once and reuse it many times. Instead of copying the same code over and over, you create a function and call it whenever you need that functionality.`,
      syntax: {
        javascript: `In JavaScript, functions are created with \`function\`:

\`\`\`javascript
// Create a function (the recipe)
function addNumbers(a, b) {
    let sum = a + b;  // Do the work
    return sum;       // Give back the result
}

// Use the function (cook the dish)
let result = addNumbers(5, 7);  // result is now 12
let another = addNumbers(10, 20);  // another is now 30

// The function is reusable - same code, different inputs!
\`\`\`

Functions save you from repeating code!`,
        python: `In Python, functions use \`def\`:

\`\`\`python
# Create function
def add_numbers(a, b):
    sum = a + b  # Do the work
    return sum   # Give back result

# Use the function
result = add_numbers(5, 7)  # result is 12
another = add_numbers(10, 20)  # another is 30
\`\`\`

Python functions are clean and readable!`,
        java: `In Java, functions are called "methods" and belong to classes:

\`\`\`java
// Methods belong to classes
public int addNumbers(int a, int b) {
    int sum = a + b;
    return sum;
}

// Call the method
int result = addNumbers(5, 7);  // result is 12
\`\`\`

Java methods are part of classes!`,
        cpp: `In C++, functions work similarly:

\`\`\`cpp
// Define function
int addNumbers(int a, int b) {
    int sum = a + b;
    return sum;
}

// Call function
int result = addNumbers(5, 7);  // result is 12
\`\`\`

C++ functions are similar to Java!`,
        typescript: `In TypeScript, functions have types:

\`\`\`typescript
// Function with types
function addNumbers(a: number, b: number): number {
    let sum = a + b;
    return sum;
}

// Use function
let result = addNumbers(5, 7);  // result is 12
\`\`\`

TypeScript functions have type safety!`
      }
    },
    functionParameters: {
      title: 'Function Parameters - Passing Data',
      context: `Function parameters are like the ingredients you give to a recipe. When you call a function, you pass in values (parameters) that the function will use to do its work.

Think of it like ordering a pizza - you tell the pizza place what toppings you want (parameters), and they use those to make your pizza (the function does its work with those values).`,
      syntax: {
        javascript: `In JavaScript, parameters go in parentheses:

\`\`\`javascript
// Function definition - a and b are parameters (placeholders)
function addNumbers(a, b) {
    return a + b;
}

// When calling, you provide actual values (arguments)
addNumbers(5, 7);    // 5 and 7 are the arguments passed to parameters a and b
addNumbers(10, 20);  // 10 and 20 are new arguments

// Parameters are like variables that get their values when you call the function
\`\`\`

Parameters make functions flexible - same function, different inputs!`,
        python: `In Python, parameters work the same way:

\`\`\`python
# a and b are parameters
def add_numbers(a, b):
    return a + b

# Provide arguments when calling
add_numbers(5, 7)    # 5 goes to a, 7 goes to b
add_numbers(10, 20)   # 10 goes to a, 20 goes to b
\`\`\`

Python parameters are straightforward!`,
        java: `In Java, parameters have types:

\`\`\`java
// Parameters must have types
public int addNumbers(int a, int b) {
    return a + b;
}

// Call with arguments
addNumbers(5, 7);    // 5 → a, 7 → b
addNumbers(10, 20);  // 10 → a, 20 → b
\`\`\`

Java requires you to specify parameter types!`,
        cpp: `In C++, parameters also have types:

\`\`\`cpp
// Parameters with types
int addNumbers(int a, int b) {
    return a + b;
}

// Call with arguments
addNumbers(5, 7);    // 5 → a, 7 → b
\`\`\`

C++ parameters need type declarations!`,
        typescript: `In TypeScript, parameters have types:

\`\`\`typescript
// Parameters with types
function addNumbers(a: number, b: number): number {
    return a + b;
}

// Call with arguments
addNumbers(5, 7);    // 5 → a, 7 → b
\`\`\`

TypeScript parameters are type-safe!`
      }
    }
  };

  const explanation = constructExplanations[construct];
  if (!explanation) return null;

  const syntax = explanation.syntax[language] || explanation.syntax.javascript;

  return (
    <BaseModal ref={scrollContainerRef} isOpen={isOpen} onClose={onClose} title={`${lang.emoji} ${explanation.title} in ${lang.name}`}>
      <div className="space-y-6 break-words">
        {/* Context Section */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-bold text-blue-900 mb-2">💡 Why do we need this?</h3>
          <p className="text-blue-800 whitespace-pre-line leading-relaxed break-words">
            {explanation.context}
          </p>
        </div>

        {/* Syntax Section */}
        <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
          <h3 className="font-bold text-gray-900 mb-2">📝 How to use it in {lang.name}:</h3>
          <div className="mt-3">
            {syntax.split('```').map((part, idx) => {
              if (idx % 2 === 1) {
                // Code block
                const lines = part.split('\n');
                const codeLang = lines[0].trim();
                const code = lines.slice(1, -1).join('\n');
                const newConcepts = detectNewConcepts(code, language);
                
                return (
                  <div key={idx}>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap break-words">
                      <code className="whitespace-pre-wrap break-words">{code}</code>
                    </pre>
                    {newConcepts.length > 0 && (
                      <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                        <h4 className="font-bold text-yellow-900 mb-2">💡 New Concept Detected:</h4>
                        {newConcepts.map((concept, cIdx) => {
                          // Mark this concept as explained
                          if (onConceptExplained && concept.key) {
                            onConceptExplained(concept.key);
                          }
                          return (
                            <div key={cIdx} className="mb-3 last:mb-0">
                              <p className="text-yellow-800 font-semibold mb-1">
                                <code className="bg-yellow-100 px-2 py-1 rounded text-sm">{concept.keyword}</code>
                              </p>
                              <p className="text-yellow-800 whitespace-pre-line leading-relaxed break-words text-sm">
                                {concept.explanation}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              } else if (part.trim()) {
                // Regular text
                return (
                  <p key={idx} className="text-gray-700 mb-3 leading-relaxed whitespace-pre-line break-words">
                    {part.split('`').map((text, i) => 
                      i % 2 === 0 ? text : <code key={i} className="bg-gray-200 px-1 rounded text-sm break-words">{text}</code>
                    )}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {['variables', 'arrays', 'forLoops', 'hashMaps', 'objects', 'functions', 'functionParameters'].indexOf(construct) + 1} of 7
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition"
          >
            {construct === 'functionParameters' ? 'Got it! Continue →' : 'Next →'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}

