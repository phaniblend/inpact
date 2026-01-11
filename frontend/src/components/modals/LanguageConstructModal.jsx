import React from 'react';
import BaseModal from './BaseModal';

export default function LanguageConstructModal({ isOpen, onClose, onNext, onPrev, construct, language, explainedConcepts = new Set(), onConceptExplained }) {
  const scrollContainerRef = React.useRef(null);
  const [showQuestionModal, setShowQuestionModal] = React.useState(false);
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [validationMessage, setValidationMessage] = React.useState('');

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
      title: 'Variables',
      realLifeExample: {
        javascript: `Think of a variable as a labeled box where you can store something.

**Real life example:**

You have a box
You put a label on it: "My Favorite Color"
You put something inside: "Blue"
Later, you can look at the box and know what's inside`,
        python: `Think of a variable as a labeled box where you can store something.

**Real life example:**

You have a box
You put a label on it: "My Favorite Color"
You put something inside: "Blue"
Later, you can look at the box and know what's inside`,
        java: `Think of a variable as a labeled box where you can store something.

**Real life example:**

You have a box
You put a label on it: "My Favorite Color"
You put something inside: "Blue"
Later, you can look at the box and know what's inside`,
        cpp: `Think of a variable as a labeled box where you can store something.

**Real life example:**

You have a box
You put a label on it: "My Favorite Color"
You put something inside: "Blue"
Later, you can look at the box and know what's inside`,
        typescript: `Think of a variable as a labeled box where you can store something.

**Real life example:**

You have a box
You put a label on it: "My Favorite Color"
You put something inside: "Blue"
Later, you can look at the box and know what's inside`
      },
      codeExample: {
        javascript: `\`\`\`javascript
let myFavoriteColor = "Blue";
\`\`\`

That's it! You created a variable (box) called \`myFavoriteColor\` and put "Blue" inside it.`,
        python: `\`\`\`python
my_favorite_color = "Blue"
\`\`\`

That's it! You created a variable (box) called \`my_favorite_color\` and put "Blue" inside it.`,
        java: `\`\`\`java
String myFavoriteColor = "Blue";
\`\`\`

That's it! You created a variable (box) called \`myFavoriteColor\` and put "Blue" inside it.`,
        cpp: `\`\`\`cpp
string myFavoriteColor = "Blue";
\`\`\`

That's it! You created a variable (box) called \`myFavoriteColor\` and put "Blue" inside it.`,
        typescript: `\`\`\`typescript
let myFavoriteColor: string = "Blue";
\`\`\`

That's it! You created a variable (box) called \`myFavoriteColor\` and put "Blue" inside it.`
      },
      breakingDown: {
        javascript: `**🔑 Breaking It Down**

\`\`\`javascript
let myFavoriteColor = "Blue";
\`\`\`

Three parts:

- \`let\` = "Hey computer, I'm making a new box!"
- \`myFavoriteColor\` = The label/name on the box
- \`"Blue"\` = What you're putting inside the box

**💡 Note:** JavaScript also has \`const\` (for values that won't change) and \`var\` (older way). We're using \`let\` here, but you'll see \`const\` used in other algorithms when we need values that shouldn't be reassigned.`,
        python: `**🔑 Breaking It Down**

\`\`\`python
my_favorite_color = "Blue"
\`\`\`

Three parts:

- \`my_favorite_color\` = The label/name on the box
- \`=\` = "Put this inside the box"
- \`"Blue"\` = What you're putting inside the box

**💡 Note:** Python variables are simple - just assign with \`=\`. There's no need for keywords like \`let\` or \`const\` like in other languages. Python figures out the type automatically!`,
        java: `**🔑 Breaking It Down**

\`\`\`java
String myFavoriteColor = "Blue";
\`\`\`

Three parts:

- \`String\` = "This box will hold text"
- \`myFavoriteColor\` = The label/name on the box
- \`"Blue"\` = What you're putting inside the box`,
        cpp: `**🔑 Breaking It Down**

\`\`\`cpp
string myFavoriteColor = "Blue";
\`\`\`

Three parts:

- \`string\` = "This box will hold text"
- \`myFavoriteColor\` = The label/name on the box
- \`"Blue"\` = What you're putting inside the box`,
        typescript: `**🔑 Breaking It Down**

\`\`\`typescript
let myFavoriteColor: string = "Blue";
\`\`\`

Three parts:

- \`let\` = "Hey computer, I'm making a new box!"
- \`myFavoriteColor: string\` = The label/name on the box (and it will hold text)
- \`"Blue"\` = What you're putting inside the box`
      }
    },
    arrays: {
      title: 'Arrays',
      realLifeExample: {
        javascript: `Think of an array as a numbered shelf where each slot holds one item.

**Real life example:**

You have a bookshelf with 4 shelves
Shelf 0: Math book
Shelf 1: Science book  
Shelf 2: History book
Shelf 3: English book
You can ask "What's on shelf 2?" and get "History book"`,
        python: `Think of an array as a numbered shelf where each slot holds one item.

**Real life example:**

You have a bookshelf with 4 shelves
Shelf 0: Math book
Shelf 1: Science book  
Shelf 2: History book
Shelf 3: English book
You can ask "What's on shelf 2?" and get "History book"`,
        java: `Think of an array as a numbered shelf where each slot holds one item.

**Real life example:**

You have a bookshelf with 4 shelves
Shelf 0: Math book
Shelf 1: Science book  
Shelf 2: History book
Shelf 3: English book
You can ask "What's on shelf 2?" and get "History book"`,
        cpp: `Think of an array as a numbered shelf where each slot holds one item.

**Real life example:**

You have a bookshelf with 4 shelves
Shelf 0: Math book
Shelf 1: Science book  
Shelf 2: History book
Shelf 3: English book
You can ask "What's on shelf 2?" and get "History book"`,
        typescript: `Think of an array as a numbered shelf where each slot holds one item.

**Real life example:**

You have a bookshelf with 4 shelves
Shelf 0: Math book
Shelf 1: Science book  
Shelf 2: History book
Shelf 3: English book
You can ask "What's on shelf 2?" and get "History book"`
      },
      codeExample: {
        javascript: `\`\`\`javascript
let books = ["Math", "Science", "History", "English"];
\`\`\`

That's it! You created an array (shelf) with 4 items.`,
        python: `\`\`\`python
books = ["Math", "Science", "History", "English"]
\`\`\`

That's it! You created an array (shelf) with 4 items.`,
        java: `\`\`\`java
String[] books = {"Math", "Science", "History", "English"};
\`\`\`

That's it! You created an array (shelf) with 4 items.`,
        cpp: `\`\`\`cpp
string books[] = {"Math", "Science", "History", "English"};
\`\`\`

That's it! You created an array (shelf) with 4 items.`,
        typescript: `\`\`\`typescript
let books: string[] = ["Math", "Science", "History", "English"];
\`\`\`

That's it! You created an array (shelf) with 4 items.`
      },
      breakingDown: {
        javascript: `**🔑 Breaking It Down**

\`\`\`javascript
let books = ["Math", "Science", "History", "English"];
books[0]  // Gets "Math" (first item, position 0)
books[2]  // Gets "History" (third item, position 2)
\`\`\`

Three parts:

- \`books\` = The name of your shelf
- \`[0]\` = Which shelf number (starts at 0, not 1!)
- \`"Math"\` = What's stored on that shelf`,
        python: `**🔑 Breaking It Down**

\`\`\`python
books = ["Math", "Science", "History", "English"]
books[0]  # Gets "Math" (first item, position 0)
books[2]  # Gets "History" (third item, position 2)
\`\`\`

Three parts:

- \`books\` = The name of your shelf
- \`[0]\` = Which shelf number (starts at 0, not 1!)
- \`"Math"\` = What's stored on that shelf`,
        java: `**🔑 Breaking It Down**

\`\`\`java
String[] books = {"Math", "Science", "History", "English"};
books[0]  // Gets "Math" (first item, position 0)
books[2]  // Gets "History" (third item, position 2)
\`\`\`

Three parts:

- \`books\` = The name of your shelf
- \`[0]\` = Which shelf number (starts at 0, not 1!)
- \`"Math"\` = What's stored on that shelf`,
        cpp: `**🔑 Breaking It Down**

\`\`\`cpp
string books[] = {"Math", "Science", "History", "English"};
books[0]  // Gets "Math" (first item, position 0)
books[2]  // Gets "History" (third item, position 2)
\`\`\`

Three parts:

- \`books\` = The name of your shelf
- \`[0]\` = Which shelf number (starts at 0, not 1!)
- \`"Math"\` = What's stored on that shelf`,
        typescript: `**🔑 Breaking It Down**

\`\`\`typescript
let books: string[] = ["Math", "Science", "History", "English"];
books[0]  // Gets "Math" (first item, position 0)
books[2]  // Gets "History" (third item, position 2)
\`\`\`

Three parts:

- \`books\` = The name of your shelf
- \`[0]\` = Which shelf number (starts at 0, not 1!)
- \`"Math"\` = What's stored on that shelf`
      }
    },
    loops: {
      title: 'Loops',
      realLifeExample: {
        javascript: `Think of a loop as repeating the same action multiple times.

**Real life example:**

You need to check homework for 5 students
Instead of saying:
"Check student 1's homework"
"Check student 2's homework"
"Check student 3's homework"
... (5 times)

You say: "For each student from 1 to 5, check their homework"
The loop does it automatically!`,
        python: `Think of a loop as repeating the same action multiple times.

**Real life example:**

You need to check homework for 5 students
Instead of saying:
"Check student 1's homework"
"Check student 2's homework"
"Check student 3's homework"
... (5 times)

You say: "For each student from 1 to 5, check their homework"
The loop does it automatically!`,
        java: `Think of a loop as repeating the same action multiple times.

**Real life example:**

You need to check homework for 5 students
Instead of saying:
"Check student 1's homework"
"Check student 2's homework"
"Check student 3's homework"
... (5 times)

You say: "For each student from 1 to 5, check their homework"
The loop does it automatically!`,
        cpp: `Think of a loop as repeating the same action multiple times.

**Real life example:**

You need to check homework for 5 students
Instead of saying:
"Check student 1's homework"
"Check student 2's homework"
"Check student 3's homework"
... (5 times)

You say: "For each student from 1 to 5, check their homework"
The loop does it automatically!`,
        typescript: `Think of a loop as repeating the same action multiple times.

**Real life example:**

You need to check homework for 5 students
Instead of saying:
"Check student 1's homework"
"Check student 2's homework"
"Check student 3's homework"
... (5 times)

You say: "For each student from 1 to 5, check their homework"
The loop does it automatically!`
      },
      codeExample: {
        javascript: `\`\`\`javascript
let numbers = [2, 7, 11, 15];
for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i]);
}
\`\`\`

That's it! The loop automatically goes through each number and prints it.`,
        python: `\`\`\`python
numbers = [2, 7, 11, 15]
for num in numbers:
    print(num)
\`\`\`

That's it! The loop automatically goes through each number and prints it.`,
        java: `\`\`\`java
int[] numbers = {2, 7, 11, 15};
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}
\`\`\`

That's it! The loop automatically goes through each number and prints it.`,
        cpp: `\`\`\`cpp
int numbers[] = {2, 7, 11, 15};
for (int i = 0; i < 4; i++) {
    cout << numbers[i] << endl;
}
\`\`\`

That's it! The loop automatically goes through each number and prints it.`,
        typescript: `\`\`\`typescript
let numbers: number[] = [2, 7, 11, 15];
for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i]);
}
\`\`\`

That's it! The loop automatically goes through each number and prints it.`
      },
      breakingDown: {
        javascript: `**🔑 Breaking It Down**

\`\`\`javascript
for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i]);
}
\`\`\`

Three parts:

- \`let i = 0\` = Start counting at 0
- \`i < numbers.length\` = Keep going while i is less than array size
- \`i++\` = After each time, increase i by 1

**💡 Note:** JavaScript has other loop types too! We'll use \`while\` loops, \`forEach\`, \`for...in\`, and \`for...of\` in other algorithms. For now, we're focusing on the \`for\` loop since it's perfect for this algorithm.`,
        python: `**🔑 Breaking It Down**

\`\`\`python
for num in numbers:
    print(num)
\`\`\`

Two parts:

- \`for num in numbers\` = "For each item in the list, call it 'num'"
- \`print(num)\` = Do something with that item

**💡 Note:** Python also has \`while\` loops and you can use \`enumerate()\` to get both index and value. We'll explore these in other algorithms when they're more suitable.`,
        java: `**🔑 Breaking It Down**

\`\`\`java
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}
\`\`\`

Three parts:

- \`int i = 0\` = Start counting at 0
- \`i < numbers.length\` = Keep going while i is less than array size
- \`i++\` = After each time, increase i by 1

**💡 Note:** Java also has \`while\` loops, \`do-while\` loops, and enhanced \`for\` loops (for-each). We'll use these in other algorithms when they fit better.`,
        cpp: `**🔑 Breaking It Down**

\`\`\`cpp
for (int i = 0; i < 4; i++) {
    cout << numbers[i] << endl;
}
\`\`\`

Three parts:

- \`int i = 0\` = Start counting at 0
- \`i < 4\` = Keep going while i is less than 4
- \`i++\` = After each time, increase i by 1

**💡 Note:** C++ also has \`while\` loops, \`do-while\` loops, and range-based \`for\` loops. We'll explore these in other algorithms when they're more appropriate.`,
        typescript: `**🔑 Breaking It Down**

\`\`\`typescript
for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i]);
}
\`\`\`

Three parts:

- \`let i = 0\` = Start counting at 0
- \`i < numbers.length\` = Keep going while i is less than array size
- \`i++\` = After each time, increase i by 1

**💡 Note:** TypeScript (like JavaScript) also has \`while\` loops, \`forEach\`, \`for...in\`, and \`for...of\`. We'll use these in other algorithms when they're better suited for the task.`
      }
    },
    functions: {
      title: 'Functions',
      realLifeExample: {
        javascript: `Think of a function as a recipe you write once and reuse.

**Real life example:**

You have a recipe for making pizza
Instead of writing the steps every time you want pizza, you write it once
Then whenever you want pizza, you just say "make pizza" and follow the recipe
The recipe (function) does the work for you!`,
        python: `Think of a function as a recipe you write once and reuse.

**Real life example:**

You have a recipe for making pizza
Instead of writing the steps every time you want pizza, you write it once
Then whenever you want pizza, you just say "make pizza" and follow the recipe
The recipe (function) does the work for you!`,
        java: `Think of a function as a recipe you write once and reuse.

**Real life example:**

You have a recipe for making pizza
Instead of writing the steps every time you want pizza, you write it once
Then whenever you want pizza, you just say "make pizza" and follow the recipe
The recipe (function) does the work for you!`,
        cpp: `Think of a function as a recipe you write once and reuse.

**Real life example:**

You have a recipe for making pizza
Instead of writing the steps every time you want pizza, you write it once
Then whenever you want pizza, you just say "make pizza" and follow the recipe
The recipe (function) does the work for you!`,
        typescript: `Think of a function as a recipe you write once and reuse.

**Real life example:**

You have a recipe for making pizza
Instead of writing the steps every time you want pizza, you write it once
Then whenever you want pizza, you just say "make pizza" and follow the recipe
The recipe (function) does the work for you!`
      },
      codeExample: {
        javascript: `\`\`\`javascript
function addNumbers(a, b) {
  return a + b;
}

let result = addNumbers(5, 7);  // result is 12
\`\`\`

That's it! You created a function (recipe) that adds two numbers.`,
        python: `\`\`\`python
def add_numbers(a, b):
    return a + b

result = add_numbers(5, 7)  # result is 12
\`\`\`

That's it! You created a function (recipe) that adds two numbers.`,
        java: `\`\`\`java
public int addNumbers(int a, int b) {
    return a + b;
}

int result = addNumbers(5, 7);  // result is 12
\`\`\`

That's it! You created a function (recipe) that adds two numbers.`,
        cpp: `\`\`\`cpp
int addNumbers(int a, int b) {
    return a + b;
}

int result = addNumbers(5, 7);  // result is 12
\`\`\`

That's it! You created a function (recipe) that adds two numbers.`,
        typescript: `\`\`\`typescript
function addNumbers(a: number, b: number): number {
  return a + b;
}

let result = addNumbers(5, 7);  // result is 12
\`\`\`

That's it! You created a function (recipe) that adds two numbers.`
      },
      breakingDown: {
        javascript: `**🔑 Breaking It Down**

\`\`\`javascript
function addNumbers(a, b) {
  return a + b;
}
\`\`\`

Three parts:

- \`function addNumbers\` = The name of your recipe
- \`(a, b)\` = The ingredients you need (parameters)
- \`return a + b\` = What the recipe produces (result)`,
        python: `**🔑 Breaking It Down**

\`\`\`python
def add_numbers(a, b):
    return a + b
\`\`\`

Three parts:

- \`def add_numbers\` = The name of your recipe
- \`(a, b)\` = The ingredients you need (parameters)
- \`return a + b\` = What the recipe produces (result)`,
        java: `**🔑 Breaking It Down**

\`\`\`java
public int addNumbers(int a, int b) {
    return a + b;
}
\`\`\`

Four parts:

- \`public int\` = The type of result (integer)
- \`addNumbers\` = The name of your recipe
- \`(int a, int b)\` = The ingredients with their types
- \`return a + b\` = What the recipe produces`,
        cpp: `**🔑 Breaking It Down**

\`\`\`cpp
int addNumbers(int a, int b) {
    return a + b;
}
\`\`\`

Four parts:

- \`int\` = The type of result (integer)
- \`addNumbers\` = The name of your recipe
- \`(int a, int b)\` = The ingredients with their types
- \`return a + b\` = What the recipe produces`,
        typescript: `**🔑 Breaking It Down**

\`\`\`typescript
function addNumbers(a: number, b: number): number {
  return a + b;
}
\`\`\`

Four parts:

- \`function addNumbers\` = The name of your recipe
- \`(a: number, b: number)\` = The ingredients with their types
- \`: number\` = The type of result
- \`return a + b\` = What the recipe produces`
      }
    },
    objects: {
      title: 'Objects',
      realLifeExample: {
        javascript: `Think of an object as a contact card that groups related information together.

**Real life example:**

You have a contact card for a friend
Instead of having separate pieces of paper:
- Name: "John"
- Age: 25
- Email: "john@email.com"

You have ONE card with all the information organized together
The card (object) keeps everything related in one place!`,
        python: `Think of an object as a contact card that groups related information together.

**Real life example:**

You have a contact card for a friend
Instead of having separate pieces of paper:
- Name: "John"
- Age: 25
- Email: "john@email.com"

You have ONE card with all the information organized together
The card (object) keeps everything related in one place!`,
        java: `Think of an object as a contact card that groups related information together.

**Real life example:**

You have a contact card for a friend
Instead of having separate pieces of paper:
- Name: "John"
- Age: 25
- Email: "john@email.com"

You have ONE card with all the information organized together
The card (object) keeps everything related in one place!`,
        cpp: `Think of an object as a contact card that groups related information together.

**Real life example:**

You have a contact card for a friend
Instead of having separate pieces of paper:
- Name: "John"
- Age: 25
- Email: "john@email.com"

You have ONE card with all the information organized together
The card (object) keeps everything related in one place!`,
        typescript: `Think of an object as a contact card that groups related information together.

**Real life example:**

You have a contact card for a friend
Instead of having separate pieces of paper:
- Name: "John"
- Age: 25
- Email: "john@email.com"

You have ONE card with all the information organized together
The card (object) keeps everything related in one place!`
      },
      codeExample: {
        javascript: `\`\`\`javascript
let person = {
  name: "John",
  age: 25,
  email: "john@email.com"
};
\`\`\`

That's it! You created an object (contact card) with all the person's information together.`,
        python: `\`\`\`python
person = {
    "name": "John",
    "age": 25,
    "email": "john@email.com"
}
\`\`\`

That's it! You created an object (contact card) with all the person's information together.`,
        java: `\`\`\`java
class Person {
    String name;
    int age;
    String email;
}

Person person = new Person();
person.name = "John";
person.age = 25;
\`\`\`

That's it! You created an object (contact card) with all the person's information together.`,
        cpp: `\`\`\`cpp
struct Person {
    string name;
    int age;
    string email;
};

Person person;
person.name = "John";
person.age = 25;
\`\`\`

That's it! You created an object (contact card) with all the person's information together.`,
        typescript: `\`\`\`typescript
let person: {name: string, age: number, email: string} = {
  name: "John",
  age: 25,
  email: "john@email.com"
};
\`\`\`

That's it! You created an object (contact card) with all the person's information together.`
      },
      breakingDown: {
        javascript: `**🔑 Breaking It Down**

\`\`\`javascript
let person = {
  name: "John",
  age: 25
};
person.name  // Gets "John"
\`\`\`

Three parts:

- \`person\` = The name of your contact card
- \`name\` = A property (piece of information) on the card
- \`"John"\` = The value stored in that property`,
        python: `**🔑 Breaking It Down**

\`\`\`python
person = {
    "name": "John",
    "age": 25
}
person["name"]  # Gets "John"
\`\`\`

Three parts:

- \`person\` = The name of your contact card
- \`"name"\` = A property (piece of information) on the card
- \`"John"\` = The value stored in that property`,
        java: `**🔑 Breaking It Down**

\`\`\`java
Person person = new Person();
person.name = "John";
person.name  // Gets "John"
\`\`\`

Three parts:

- \`person\` = The name of your contact card
- \`.name\` = A property (piece of information) on the card
- \`"John"\` = The value stored in that property`,
        cpp: `**🔑 Breaking It Down**

\`\`\`cpp
Person person;
person.name = "John";
person.name  // Gets "John"
\`\`\`

Three parts:

- \`person\` = The name of your contact card
- \`.name\` = A property (piece of information) on the card
- \`"John"\` = The value stored in that property`,
        typescript: `**🔑 Breaking It Down**

\`\`\`typescript
let person = {
  name: "John",
  age: 25
};
person.name  // Gets "John"
\`\`\`

Three parts:

- \`person\` = The name of your contact card
- \`name\` = A property (piece of information) on the card
- \`"John"\` = The value stored in that property`
      }
    }
  };

  const explanation = constructExplanations[construct];
  if (!explanation) return null;

  // Get construct order - use the order from PracticeTutorial
  const constructOrder = ['variables', 'arrays', 'loops', 'functions', 'objects'];
  const currentIndex = constructOrder.indexOf(construct);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === constructOrder.length - 1;
  const totalConstructs = constructOrder.length;

  // Handle navigation
  const handlePrevious = () => {
    if (!isFirst && onPrev) {
      onPrev();
    }
  };

  const handleNext = () => {
    if (!isLast && onNext) {
      onNext();
    } else if (isLast && onClose) {
      // Close modal on last construct
      onClose();
    }
  };

  // Validate if question is about current construct
  const validateQuestion = (questionText) => {
    const questionLower = questionText.toLowerCase().trim();
    
    // Keywords for each construct (more specific to avoid false positives)
    const constructKeywords = {
      variables: ['variable', 'var ', 'let ', 'const ', 'declare', 'assign', 'store', 'container', 'box', 'value'],
      arrays: ['array', 'list', 'index', 'element', 'position', 'shelf', 'bracket', 'length', 'items'],
      loops: ['loop', 'for ', 'while ', 'iterate', 'repeat', 'each', 'iteration', 'cycle', 'through'],
      functions: ['function', 'method', 'def ', 'call', 'invoke', 'return', 'parameter', 'argument'],
      objects: ['object', 'property', 'key', 'dictionary', 'map', 'dot notation', 'class', 'struct']
    };

    const currentKeywords = constructKeywords[construct] || [];
    const otherConstructs = Object.keys(constructKeywords).filter(c => c !== construct);
    
    // Count mentions of current vs other constructs
    let currentMentions = 0;
    let otherMentions = 0;
    let detectedOtherConstruct = null;

    // Check for current construct keywords
    for (const keyword of currentKeywords) {
      if (questionLower.includes(keyword)) {
        currentMentions++;
      }
    }

    // Check for other construct keywords
    for (const otherConstruct of otherConstructs) {
      const otherKeywords = constructKeywords[otherConstruct];
      for (const keyword of otherKeywords) {
        if (questionLower.includes(keyword)) {
          otherMentions++;
          if (!detectedOtherConstruct) {
            detectedOtherConstruct = otherConstruct;
          }
        }
      }
    }

    // If question is too short
    if (questionLower.length < 10) {
      return {
        isValid: false,
        message: 'Please ask a more specific question about the current concept.'
      };
    }

    // If question mentions other constructs more prominently than current construct
    if (otherMentions > currentMentions && detectedOtherConstruct) {
      const constructNames = {
        variables: 'variables',
        arrays: 'arrays',
        loops: 'loops',
        functions: 'functions',
        objects: 'objects'
      };
      
      return {
        isValid: false,
        message: `While we appreciate your enthusiasm in learning, we recommend taking it slow and learning about ${constructNames[detectedOtherConstruct]} when we get to that concept. Right now, let's focus on ${constructNames[construct]}. Feel free to ask questions about ${constructNames[construct]}!`
      };
    }

    // If question mentions other constructs but also mentions current construct, allow it
    // (might be a comparison question which is fine)
    if (otherMentions > 0 && currentMentions > 0) {
      return { isValid: true, message: '' };
    }

    // If question only mentions other constructs strongly, block it
    if (otherMentions >= 2 && currentMentions === 0 && detectedOtherConstruct) {
      const constructNames = {
        variables: 'variables',
        arrays: 'arrays',
        loops: 'loops',
        functions: 'functions',
        objects: 'objects'
      };
      
      return {
        isValid: false,
        message: `While we appreciate your enthusiasm in learning, we recommend taking it slow and learning about ${constructNames[detectedOtherConstruct]} when we get to that concept. Right now, let's focus on ${constructNames[construct]}. Feel free to ask questions about ${constructNames[construct]}!`
      };
    }

    // Otherwise, allow the question
    return { isValid: true, message: '' };
  };

  const handleAskQuestion = async () => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    // Validate question
    const validation = validateQuestion(trimmedQuestion);
    if (!validation.isValid) {
      setValidationMessage(validation.message);
      return;
    }

    setValidationMessage('');
    setIsLoading(true);
    setAnswer('');

    try {
      const apiUrl = import.meta.env.DEV
        ? `/api/mentor/ask-question`
        : `/api/mentor/ask-question`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          concept: construct,
          question: trimmedQuestion,
          language: language || 'javascript'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('API Error:', response.status, errorData);
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle backend response format: { success: true, answer: ... } or { success: false, message: ... }
      if (data.success && data.answer) {
        setAnswer(data.answer);
      } else if (data.message) {
        // Backend returned an error message
        throw new Error(data.message);
      } else {
        throw new Error('Unexpected response format from server');
      }
    } catch (err) {
      console.error('Failed to submit question:', err);
      setAnswer(`Sorry, there was an error getting an answer: ${err.message}. Please check that the backend server is running and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseQuestionModal = () => {
    setShowQuestionModal(false);
    setQuestion('');
    setAnswer('');
    setValidationMessage('');
  };

  // Check if explanation has new format (realLifeExample, codeExample, breakingDown)
  const hasNewFormat = explanation.realLifeExample && explanation.codeExample && explanation.breakingDown;

  if (hasNewFormat) {
    // New format: Real-life example, Code example, Breaking it down
    const realLife = explanation.realLifeExample[language] || explanation.realLifeExample.javascript;
    const codeExample = explanation.codeExample[language] || explanation.codeExample.javascript;
    const breakingDown = explanation.breakingDown[language] || explanation.breakingDown.javascript;

    return (
      <BaseModal ref={scrollContainerRef} isOpen={isOpen} onClose={onClose} title={`${lang.emoji} ${explanation.title} in ${lang.name}`}>
        <div className="space-y-6 break-words">
          {/* Real-life Example Section */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-blue-800 whitespace-pre-line leading-relaxed break-words">
              {realLife.split('**').map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
              )}
            </p>
          </div>

          {/* Code Example Section */}
          <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
            <h3 className="font-bold text-gray-900 mb-2">In programming:</h3>
            <div className="mt-3">
              {codeExample.split('```').map((part, idx) => {
                if (idx % 2 === 1) {
                  // Code block
                  const lines = part.split('\n');
                  const code = lines.slice(1, -1).join('\n');
                  
                  return (
                    <pre key={idx} className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap break-words">
                      <code className="whitespace-pre-wrap break-words">{code}</code>
                    </pre>
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

          {/* Breaking It Down Section */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="mt-3">
              {breakingDown.split('```').map((part, idx) => {
                if (idx % 2 === 1) {
                  // Code block
                  const lines = part.split('\n');
                  const code = lines.slice(1, -1).join('\n');
                  
                  return (
                    <pre key={idx} className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap break-words">
                      <code className="whitespace-pre-wrap break-words">{code}</code>
                    </pre>
                  );
                } else if (part.trim()) {
                  // Regular text
                  return (
                    <p key={idx} className="text-yellow-800 mb-3 leading-relaxed whitespace-pre-line break-words">
                      {part.split('`').map((text, i) => 
                        i % 2 === 0 ? text : <code key={i} className="bg-yellow-100 px-1 rounded text-sm break-words">{text}</code>
                      )}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Ask a Question Button */}
          <div className="pt-4 border-t">
            <button
              onClick={() => setShowQuestionModal(true)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold flex items-center justify-center gap-2"
            >
              <span>💬</span>
              Ask a Question About {explanation.title}
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={handlePrevious}
              disabled={isFirst}
              className={`px-6 py-2 border-2 rounded-lg font-semibold transition ${
                isFirst 
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                  : 'border-inpact-green text-inpact-green hover:bg-inpact-green hover:text-black'
              }`}
            >
              ← Previous
            </button>
            <div className="text-sm text-gray-500">
              {currentIndex + 1} of {totalConstructs}
            </div>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition"
            >
              {isLast ? 'Got it! Continue →' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Ask Question Modal */}
        {showQuestionModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-inpact-dark">Ask a Question About {explanation.title}</h2>
                <button
                  onClick={handleCloseQuestionModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {!answer ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        What would you like to know about {construct}?
                      </label>
                      <textarea
                        value={question}
                        onChange={(e) => {
                          setQuestion(e.target.value);
                          setValidationMessage('');
                        }}
                        placeholder="Type your question here..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-inpact-green focus:border-transparent resize-none"
                        rows="4"
                        disabled={isLoading}
                      />
                    </div>

                    {validationMessage && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <p className="text-yellow-800 text-sm leading-relaxed">{validationMessage}</p>
                      </div>
                    )}

                    <button
                      onClick={handleAskQuestion}
                      disabled={isLoading || !question.trim()}
                      className="w-full px-6 py-3 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Asking...' : 'Ask Question'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <h3 className="font-bold text-blue-900 mb-2">Your Question:</h3>
                      <p className="text-blue-800">{question}</p>
                    </div>

                    <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
                      <h3 className="font-bold text-gray-900 mb-2">Answer:</h3>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{answer}</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setQuestion('');
                          setAnswer('');
                          setValidationMessage('');
                        }}
                        className="flex-1 px-4 py-2 border-2 border-inpact-green text-inpact-green rounded-lg hover:bg-inpact-green hover:text-black transition font-semibold"
                      >
                        Ask Another Question
                      </button>
                      <button
                        onClick={handleCloseQuestionModal}
                        className="flex-1 px-4 py-2 bg-inpact-green text-black rounded-lg hover:shadow-lg transition font-semibold"
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </BaseModal>
    );
  }

  // Fallback to old format (for backwards compatibility)
  const syntax = explanation.syntax?.[language] || explanation.syntax?.javascript || '';

  return (
    <BaseModal ref={scrollContainerRef} isOpen={isOpen} onClose={onClose} title={`${lang.emoji} ${explanation.title} in ${lang.name}`}>
      <div className="space-y-6 break-words">
        {/* Context Section */}
        {explanation.context && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-bold text-blue-900 mb-2">💡 Why do we need this?</h3>
            <p className="text-blue-800 whitespace-pre-line leading-relaxed break-words">
              {explanation.context}
            </p>
          </div>
        )}

        {/* Syntax Section */}
        {syntax && (
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
        )}

        {/* Ask a Question Button */}
        <div className="pt-4 border-t">
          <button
            onClick={() => setShowQuestionModal(true)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold flex items-center justify-center gap-2"
          >
            <span>💬</span>
            Ask a Question About {explanation.title}
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <button
            onClick={handlePrevious}
            disabled={isFirst}
            className={`px-6 py-2 border-2 rounded-lg font-semibold transition ${
              isFirst 
                ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                : 'border-inpact-green text-inpact-green hover:bg-inpact-green hover:text-black'
            }`}
          >
            ← Previous
          </button>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} of {totalConstructs}
          </div>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition"
          >
            {isLast ? 'Got it! Continue →' : 'Next →'}
          </button>
        </div>

        {/* Ask Question Modal */}
        {showQuestionModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-inpact-dark">Ask a Question About {explanation.title}</h2>
                <button
                  onClick={handleCloseQuestionModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {!answer ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        What would you like to know about {construct}?
                      </label>
                      <textarea
                        value={question}
                        onChange={(e) => {
                          setQuestion(e.target.value);
                          setValidationMessage('');
                        }}
                        placeholder="Type your question here..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-inpact-green focus:border-transparent resize-none"
                        rows="4"
                        disabled={isLoading}
                      />
                    </div>

                    {validationMessage && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <p className="text-yellow-800 text-sm leading-relaxed">{validationMessage}</p>
                      </div>
                    )}

                    <button
                      onClick={handleAskQuestion}
                      disabled={isLoading || !question.trim()}
                      className="w-full px-6 py-3 bg-inpact-green text-black font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Asking...' : 'Ask Question'}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <h3 className="font-bold text-blue-900 mb-2">Your Question:</h3>
                      <p className="text-blue-800">{question}</p>
                    </div>

                    <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded">
                      <h3 className="font-bold text-gray-900 mb-2">Answer:</h3>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{answer}</p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setQuestion('');
                          setAnswer('');
                          setValidationMessage('');
                        }}
                        className="flex-1 px-4 py-2 border-2 border-inpact-green text-inpact-green rounded-lg hover:bg-inpact-green hover:text-black transition font-semibold"
                      >
                        Ask Another Question
                      </button>
                      <button
                        onClick={handleCloseQuestionModal}
                        className="flex-1 px-4 py-2 bg-inpact-green text-black rounded-lg hover:shadow-lg transition font-semibold"
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  );
}

