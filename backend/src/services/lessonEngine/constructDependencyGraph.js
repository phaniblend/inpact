/**
 * Construct Dependency Graph
 * 
 * GLOBAL, LANGUAGE-AGNOSTIC dependency relationships between programming constructs.
 * Base constructs (variables, primitives) have no prerequisites.
 * Works for: JavaScript, Python, Java, Go, Swift, React, Angular, Node.js, etc.
 * 
 * NOTE: Hash maps/dictionaries and objects are treated as equivalent concepts
 * (both are key-value structures requiring only variables as prerequisite).
 * In JavaScript: Objects ARE hash maps. In Python: Dictionaries are hash maps.
 * For teaching purposes, they're the same level of abstraction.
 */

/**
 * Get prerequisites for a construct
 * Returns empty array for base constructs
 * Language-agnostic: works for all programming languages
 */
export function getConstructPrerequisites(constructName, language = 'javascript') {
  const normalizedName = constructName.toLowerCase().trim();
  
  // Base constructs - UNIVERSAL across all languages (no prerequisites)
  const baseConstructs = [
    'variables', 'variable', 'var', 'let', 'const', 'val', 'mut',
    'primitives', 'primitive', 'types', 'type', 'datatypes', 'datatype',
    'numbers', 'number', 'int', 'integer', 'float', 'double',
    'strings', 'string', 'str',
    'booleans', 'boolean', 'bool',
    'literals', 'literal', 'values', 'value',
    'null', 'undefined', 'none', 'nil'
  ];
  
  if (baseConstructs.includes(normalizedName)) {
    return [];
  }
  
  // UNIVERSAL dependency graph - applies to all languages
  const universalDependencies = {
    // Arrays and collections (universal)
    'arrays': ['variables'],
    'array': ['variables'],
    'lists': ['variables'],
    'list': ['variables'],
    'vectors': ['variables'],
    'vector': ['variables'],
    'array methods': ['arrays', 'functions'],
    'array method': ['arrays', 'functions'],
    'list methods': ['lists', 'functions'],
    'list method': ['lists', 'functions'],
    
    // Functions (universal)
    'functions': ['variables'],
    'function': ['variables'],
    'methods': ['functions'],
    'method': ['functions'],
    'procedures': ['functions'],
    'procedure': ['functions'],
    'arrow functions': ['functions'],
    'arrow function': ['functions'],
    'lambda': ['functions'],
    'closures': ['functions'],
    'closure': ['functions'],
    'callbacks': ['functions'],
    'callback': ['functions'],
    
    // Objects/Classes (universal)
    'objects': ['variables'],
    'object': ['variables'],
    'classes': ['objects', 'functions'],
    'class': ['objects', 'functions'],
    'structs': ['variables'],
    'struct': ['variables'],
    'interfaces': ['objects'],
    'interface': ['objects'],
    'traits': ['objects'],
    'trait': ['objects'],
    
    // Hash Maps/Dictionaries - essentially the same as objects in most languages
    // In JS: Objects ARE hash maps. In Python: Dictionaries are hash maps (similar to objects).
    // For teaching purposes, they're the same concept - key-value storage
    'hash-map': ['variables'], // Same level as objects - not a prerequisite of objects
    'hash map': ['variables'],
    'hashmap': ['variables'],
    'dictionaries': ['variables'], // Python dicts - same level as objects
    'dictionary': ['variables'],
    'dict': ['variables'],
    'maps': ['variables'], // Go maps, Swift dictionaries - same level
    'map': ['variables'],
    'hash tables': ['variables'],
    'hash table': ['variables'],
    
    // Control flow (universal)
    'conditionals': ['variables', 'expressions'],
    'conditional': ['variables', 'expressions'],
    'if statements': ['conditionals'],
    'if statement': ['conditionals'],
    'if-else': ['conditionals'],
    'switch': ['conditionals'],
    'match': ['conditionals'],
    'expressions': ['variables'],
    'expression': ['variables'],
    
    // Loops (universal)
    'loops': ['variables', 'arrays', 'conditionals'],
    'loop': ['variables', 'arrays', 'conditionals'],
    'for loops': ['loops'],
    'for loop': ['loops'],
    'while loops': ['loops'],
    'while loop': ['loops'],
    'for-each': ['loops', 'arrays'],
    'foreach': ['loops', 'arrays'],
    'iterators': ['loops', 'arrays'],
    'iterator': ['loops', 'arrays'],
    
    // React/Component concepts (framework-specific)
    'components': ['functions', 'objects'],
    'component': ['functions', 'objects'],
    'jsx': ['components', 'expressions'],
    'tsx': ['components', 'expressions'],
    'props': ['components', 'objects'],
    'state': ['components', 'variables'],
    'effects': ['components', 'functions'],
    'hooks': ['components', 'functions'],
    'directives': ['components'],
    'directive': ['components'],
    'services': ['functions', 'objects'],
    'service': ['functions', 'objects'],
    'dependency-injection': ['services', 'objects'],
    'dependency injection': ['services', 'objects'],
    
    // API/Backend concepts (universal)
    'apis': ['functions', 'objects'],
    'api': ['functions', 'objects'],
    'endpoints': ['apis'],
    'endpoint': ['apis'],
    'routes': ['apis'],
    'route': ['apis'],
    'middleware': ['functions', 'apis'],
    'handlers': ['functions', 'apis'],
    'handler': ['functions', 'apis'],
    'controllers': ['functions', 'apis'],
    'controller': ['functions', 'apis'],
    
    // Async/Concurrency (universal)
    'async': ['functions'],
    'asynchronous': ['functions'],
    'promises': ['functions'],
    'promise': ['functions'],
    'futures': ['functions'],
    'future': ['functions'],
    'async-await': ['async', 'promises'],
    'async await': ['async', 'promises'],
    'coroutines': ['functions'],
    'coroutine': ['functions'],
    'goroutines': ['functions'],
    'goroutine': ['functions'],
    'threads': ['functions'],
    'thread': ['functions'],
    
    // Modules/Packages (universal)
    'modules': ['functions', 'objects'],
    'module': ['functions', 'objects'],
    'packages': ['modules'],
    'package': ['modules'],
    'imports': ['modules'],
    'import': ['modules'],
    'exports': ['modules'],
    'export': ['modules'],
    
    // Error handling (universal)
    'exceptions': ['functions', 'conditionals'],
    'exception': ['functions', 'conditionals'],
    'error handling': ['exceptions'],
    'try-catch': ['exceptions'],
    'try catch': ['exceptions'],
    'defer': ['functions'],
    'finally': ['exceptions'],
  };
  
  // Language-specific dependencies
  const languageSpecificDeps = {
    javascript: {
      'prototypes': ['objects'],
      'prototype': ['objects'],
      'this': ['objects', 'functions'],
    },
    python: {
      'decorators': ['functions'],
      'decorator': ['functions'],
      'generators': ['functions'],
      'generator': ['functions'],
      'comprehensions': ['loops', 'arrays'],
      'comprehension': ['loops', 'arrays'],
    },
    java: {
      'annotations': ['classes'],
      'annotation': ['classes'],
      'generics': ['classes'],
      'generic': ['classes'],
    },
    go: {
      'goroutines': ['functions'],
      'goroutine': ['functions'],
      'channels': ['goroutines'],
      'channel': ['goroutines'],
    },
    swift: {
      'protocols': ['classes'],
      'protocol': ['classes'],
      'optionals': ['variables'],
      'optional': ['variables'],
      'extensions': ['classes'],
      'extension': ['classes'],
    },
  };
  
  // Merge language-specific dependencies
  const allDependencies = { ...universalDependencies };
  if (languageSpecificDeps[language]) {
    Object.assign(allDependencies, languageSpecificDeps[language]);
  }
  
  // Check exact match first
  if (allDependencies[normalizedName]) {
    return allDependencies[normalizedName];
  }
  
  // Check partial matches (e.g., "array methods" contains "arrays")
  for (const [key, prereqs] of Object.entries(allDependencies)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return prereqs;
    }
  }
  
  // Default: assume it depends on variables (most constructs do)
  // But if it's clearly a base concept, return empty
  if (normalizedName.includes('variable') || normalizedName.includes('primitive') || normalizedName.includes('type')) {
    return [];
  }
  
  return ['variables']; // Default prerequisite - universal across all languages
}

/**
 * Check if a construct is a base construct
 */
export function isBaseConstruct(constructName) {
  const prereqs = getConstructPrerequisites(constructName);
  return prereqs.length === 0;
}

/**
 * Build full dependency tree for a construct
 */
export function buildDependencyTree(constructName, language = 'javascript') {
  const visited = new Set();
  const tree = [];
  
  function traverse(construct) {
    if (visited.has(construct)) {
      return; // Avoid cycles
    }
    visited.add(construct);
    
    const prereqs = getConstructPrerequisites(construct, language);
    if (prereqs.length === 0) {
      // Base construct
      if (!tree.includes(construct)) {
        tree.push(construct);
      }
      return;
    }
    
    // Recursively traverse prerequisites
    prereqs.forEach(prereq => traverse(prereq));
    
    // Add current construct after prerequisites
    if (!tree.includes(construct)) {
      tree.push(construct);
    }
  }
  
  traverse(constructName);
  return tree;
}
