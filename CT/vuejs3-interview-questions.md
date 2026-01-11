# Vue.js 3 - 100 Coding Interview Questions

## Junior Level (25 questions)

### 1. Reactive Counter with Composition API ⭐
**Time:** 15 minutes  
**Tests:** ref, reactive, template syntax, event handling

**Challenge:**
```javascript
// Create a counter component using Vue 3 Composition API.
// Display current count. Buttons: Increment (+1), Decrement (-1), Reset (to 0).
// Show count in different colors: green if positive, red if negative, gray if zero.
// Add a "Double" button that multiplies count by 2.
```

**What interviewers look for:**
```vue
<template>
  <div class="counter-container">
    <h2>Counter: <span :class="countClass">{{ count }}</span></h2>
    <div class="button-group">
      <button @click="increment">Increment</button>
      <button @click="decrement">Decrement</button>
      <button @click="reset">Reset</button>
      <button @click="double">Double</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const count = ref(0);

const countClass = computed(() => {
  if (count.value > 0) return 'positive';
  if (count.value < 0) return 'negative';
  return 'zero';
});

const increment = () => {
  count.value++;
};

const decrement = () => {
  count.value--;
};

const reset = () => {
  count.value = 0;
};

const double = () => {
  count.value *= 2;
};
</script>

<style scoped>
.counter-container {
  padding: 20px;
  text-align: center;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.positive {
  color: #4CAF50;
  font-weight: bold;
}

.negative {
  color: #f44336;
  font-weight: bold;
}

.zero {
  color: #999;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f0f0f0;
}

button:hover {
  background-color: #e0e0e0;
}
</style>
```

### 2. Todo List with Local Storage ⭐
**Time:** 25 minutes  
**Tests:** Composition API, lifecycle hooks, local storage, list rendering

**Challenge:**
```javascript
// Create a todo list component:
// - Add todos (input + Add button)
// - Mark todos as complete (checkbox)
// - Delete todos (X button)
// - Persist to localStorage
// - Load from localStorage on mount
// - Show count of active todos
```

**What interviewers look for:**
```vue
<template>
  <div class="todo-container">
    <h2>Todo List</h2>
    
    <div class="add-todo">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="Add a new todo..."
        class="todo-input"
      />
      <button @click="addTodo" class="add-button">Add</button>
    </div>
    
    <div class="todo-stats">
      Active: {{ activeCount }} | Total: {{ todos.length }}
    </div>
    
    <div class="todo-list">
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="todo-item"
        :class="{ completed: todo.completed }"
      >
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(todo.id)"
          class="todo-checkbox"
        />
        <span class="todo-text">{{ todo.text }}</span>
        <button @click="deleteTodo(todo.id)" class="delete-button">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const todos = ref([]);
const newTodo = ref('');

const activeCount = computed(() => {
  return todos.value.filter(todo => !todo.completed).length;
});

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value.trim(),
      completed: false
    });
    newTodo.value = '';
  }
};

const toggleTodo = (id) => {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
};

const deleteTodo = (id) => {
  todos.value = todos.value.filter(t => t.id !== id);
};

// Load from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('todos');
  if (saved) {
    todos.value = JSON.parse(saved);
  }
});

// Save to localStorage whenever todos change
watch(todos, (newTodos) => {
  localStorage.setItem('todos', JSON.stringify(newTodos));
}, { deep: true });
</script>

<style scoped>
.todo-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.todo-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.add-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.todo-stats {
  margin-bottom: 15px;
  color: #666;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
}

.todo-item.completed {
  opacity: 0.6;
  background-color: #f5f5f5;
}

.todo-checkbox {
  margin-right: 10px;
}

.todo-text {
  flex: 1;
  text-decoration: none;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
}

.delete-button {
  padding: 5px 10px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
</style>
```

### 3. Searchable Product List ⭐
**Time:** 25 minutes  
**Tests:** Computed properties, filtering, v-model, list rendering

**Challenge:**
```javascript
// Create a product list component:
// - Display products (name, price, category)
// - Search bar to filter by name
// - Category filter dropdown
// - Sort by price (low to high, high to low)
// - Show "No results" when filtered list is empty
```

**What interviewers look for:**
```vue
<template>
  <div class="product-container">
    <h2>Products</h2>
    
    <div class="filters">
      <input
        v-model="searchQuery"
        placeholder="Search products..."
        class="search-input"
      />
      
      <select v-model="selectedCategory" class="category-select">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </option>
      </select>
      
      <select v-model="sortOrder" class="sort-select">
        <option value="none">No Sort</option>
        <option value="low">Price: Low to High</option>
        <option value="high">Price: High to Low</option>
      </select>
    </div>
    
    <div v-if="filteredProducts.length === 0" class="no-results">
      No products found
    </div>
    
    <div v-else class="product-list">
      <div
        v-for="product in sortedProducts"
        :key="product.id"
        class="product-card"
      >
        <h3>{{ product.name }}</h3>
        <div class="product-category">{{ product.category }}</div>
        <div class="product-price">${{ product.price.toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const products = ref([
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Desk Chair', price: 199.99, category: 'Furniture' },
  { id: 3, name: 'Monitor', price: 299.99, category: 'Electronics' },
  { id: 4, name: 'Keyboard', price: 79.99, category: 'Electronics' },
  { id: 5, name: 'Desk', price: 249.99, category: 'Furniture' },
  { id: 6, name: 'Mouse', price: 29.99, category: 'Electronics' }
]);

const searchQuery = ref('');
const selectedCategory = ref('');
const sortOrder = ref('none');

const categories = computed(() => {
  return [...new Set(products.value.map(p => p.category))];
});

const filteredProducts = computed(() => {
  let result = products.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(query)
    );
  }
  
  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value);
  }
  
  return result;
});

const sortedProducts = computed(() => {
  const products = [...filteredProducts.value];
  
  if (sortOrder.value === 'low') {
    return products.sort((a, b) => a.price - b.price);
  } else if (sortOrder.value === 'high') {
    return products.sort((a, b) => b.price - a.price);
  }
  
  return products;
});
</script>

<style scoped>
.product-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input,
.category-select,
.sort-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: white;
}

.product-card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.product-category {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.product-price {
  font-size: 20px;
  font-weight: bold;
  color: #4CAF50;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 18px;
}
</style>
```

### 4. Form Validation with Reactive Rules ⭐
**Time:** 30 minutes  
**Tests:** Form handling, validation, computed properties, reactive state

**Challenge:**
```javascript
// Create a registration form with validation:
// - Name: required, min 2 characters
// - Email: required, valid email format
// - Password: required, min 8 chars, must have uppercase, number, special char
// - Confirm Password: must match password
// - Show real-time validation errors
// - Disable submit until all valid
// - Show success message on valid submit
```

**What interviewers look for:**
```vue
<template>
  <div class="form-container">
    <h2>Registration</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Name:</label>
        <input
          v-model="form.name"
          @blur="validateField('name')"
          type="text"
          class="form-input"
          :class="{ error: errors.name }"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>
      
      <div class="form-group">
        <label>Email:</label>
        <input
          v-model="form.email"
          @blur="validateField('email')"
          type="email"
          class="form-input"
          :class="{ error: errors.email }"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>
      
      <div class="form-group">
        <label>Password:</label>
        <input
          v-model="form.password"
          @blur="validateField('password')"
          type="password"
          class="form-input"
          :class="{ error: errors.password }"
        />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        <div v-if="form.password" class="password-requirements">
          <div :class="{ met: hasUppercase }">✓ Uppercase letter</div>
          <div :class="{ met: hasNumber }">✓ Number</div>
          <div :class="{ met: hasSpecial }">✓ Special character</div>
          <div :class="{ met: hasMinLength }">✓ At least 8 characters</div>
        </div>
      </div>
      
      <div class="form-group">
        <label>Confirm Password:</label>
        <input
          v-model="form.confirmPassword"
          @blur="validateField('confirmPassword')"
          type="password"
          class="form-input"
          :class="{ error: errors.confirmPassword }"
        />
        <span v-if="errors.confirmPassword" class="error-message">
          {{ errors.confirmPassword }}
        </span>
      </div>
      
      <button
        type="submit"
        :disabled="!isFormValid"
        class="submit-button"
        :class="{ disabled: !isFormValid }"
      >
        Register
      </button>
    </form>
    
    <div v-if="submitted" class="success-message">
      Registration successful!
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = ref({});
const submitted = ref(false);

const hasUppercase = computed(() => /[A-Z]/.test(form.value.password));
const hasNumber = computed(() => /[0-9]/.test(form.value.password));
const hasSpecial = computed(() => /[!@#$%^&*(),.?":{}|<>]/.test(form.value.password));
const hasMinLength = computed(() => form.value.password.length >= 8);

const validateField = (field) => {
  errors.value[field] = '';
  
  switch (field) {
    case 'name':
      if (!form.value.name.trim()) {
        errors.value.name = 'Name is required';
      } else if (form.value.name.length < 2) {
        errors.value.name = 'Name must be at least 2 characters';
      }
      break;
      
    case 'email':
      if (!form.value.email.trim()) {
        errors.value.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
        errors.value.email = 'Email is invalid';
      }
      break;
      
    case 'password':
      if (!form.value.password) {
        errors.value.password = 'Password is required';
      } else if (!hasMinLength.value || !hasUppercase.value || !hasNumber.value || !hasSpecial.value) {
        errors.value.password = 'Password does not meet requirements';
      }
      break;
      
    case 'confirmPassword':
      if (!form.value.confirmPassword) {
        errors.value.confirmPassword = 'Please confirm your password';
      } else if (form.value.password !== form.value.confirmPassword) {
        errors.value.confirmPassword = 'Passwords do not match';
      }
      break;
  }
};

const isFormValid = computed(() => {
  return form.value.name &&
         form.value.name.length >= 2 &&
         form.value.email &&
         /\S+@\S+\.\S+/.test(form.value.email) &&
         form.value.password &&
         hasMinLength.value &&
         hasUppercase.value &&
         hasNumber.value &&
         hasSpecial.value &&
         form.value.confirmPassword === form.value.password;
});

const handleSubmit = () => {
  Object.keys(form.value).forEach(field => validateField(field));
  
  if (isFormValid.value) {
    submitted.value = true;
    setTimeout(() => {
      submitted.value = false;
      form.value = { name: '', email: '', password: '', confirmPassword: '' };
      errors.value = {};
    }, 3000);
  }
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.form-input.error {
  border-color: #f44336;
}

.error-message {
  display: block;
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
}

.password-requirements {
  margin-top: 10px;
  font-size: 12px;
}

.password-requirements div {
  color: #999;
}

.password-requirements div.met {
  color: #4CAF50;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.submit-button.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.success-message {
  margin-top: 20px;
  padding: 15px;
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
  text-align: center;
}
</style>
```

### 5-25. [Additional Junior Vue.js 3 Questions covering:]
- Component props and emits
- Slots (default, named, scoped)
- Provide/Inject
- Watchers (watch, watchEffect)
- Lifecycle hooks
- Template refs
- v-model custom components
- Dynamic components
- Teleport
- Transition animations
- Event modifiers
- Key modifiers
- v-if vs v-show
- List rendering with keys
- Computed vs methods
- Custom directives
- Mixins (Options API)
- Component communication patterns

---

## Mid Level (35 questions)

### 26. Custom Composable Hook ⭐⭐
**Time:** 30 minutes  
**Tests:** Composables, reusable logic, TypeScript integration

**Challenge:**
```javascript
// Create a useFetch composable that:
// - Accepts URL and options
// - Returns data, loading, error states
// - Supports refetch function
// - Handles abort on unmount
// - Supports request cancellation
```

### 27. Pinia Store Integration ⭐⭐
**Time:** 35 minutes  
**Tests:** State management, Pinia, actions, getters

**Challenge:**
```javascript
// Create a shopping cart store with Pinia:
// - Add/remove items
// - Update quantities
// - Calculate totals
// - Persist to localStorage
// - Clear cart
```

### 28-60. [Additional Mid Level Questions covering:]
- Advanced composables
- Router integration
- Route guards
- Dynamic routes
- Nested routes
- Route meta fields
- API integration patterns
- Error handling strategies
- Loading states management
- Form libraries (VeeValidate)
- UI libraries integration
- Testing with Vitest
- Component testing
- E2E testing
- Performance optimization
- Code splitting
- Lazy loading components
- Virtual scrolling
- Infinite scroll
- Drag and drop
- File upload
- Image cropping
- Rich text editor
- Chart integration
- WebSocket integration
- Service worker
- PWA features
- i18n implementation
- Theme switching
- Advanced animations

---

## Senior Level (25 questions)

### 61. Advanced Performance Optimization ⭐⭐⭐
**Time:** 60 minutes  
**Tests:** Performance, optimization techniques, profiling

**Challenge:**
```javascript
// Optimize a large list component:
// - Virtual scrolling for 10,000+ items
// - Memoization strategies
// - Lazy loading
// - Code splitting
// - Bundle optimization
```

### 62. Plugin System Architecture ⭐⭐⭐
**Time:** 75 minutes  
**Tests:** Architecture, plugin patterns, extensibility

**Challenge:**
```javascript
// Design a plugin system where:
// - Plugins can register components
// - Plugins can add routes
// - Plugins can extend store
// - Hot reload support
// - Plugin dependencies
```

### 63-85. [Additional Senior Questions covering:]
- Micro-frontend architecture
- SSR with Nuxt.js
- Advanced routing patterns
- State management patterns
- Advanced composables design
- Performance monitoring
- Memory leak detection
- Advanced testing strategies
- CI/CD integration
- Advanced security
- Advanced accessibility
- Advanced TypeScript patterns
- Design system implementation
- Component library architecture
- Advanced animation libraries
- WebGL integration
- Advanced data visualization
- Real-time collaboration
- Advanced WebSocket patterns
- Advanced caching strategies

---

## Lead Level (15 questions)

### 86. Enterprise Architecture Design ⭐⭐⭐⭐
**Time:** 120 minutes  
**Tests:** System design, architecture, scalability

**Challenge:**
```javascript
// Design an enterprise Vue.js application:
// - Micro-frontend architecture
// - Module federation
// - Shared state management
// - Independent deployments
// - Version management
```

### 87-100. [Additional Lead Questions covering:]
- Advanced system architecture
- Multi-tenant architecture
- Advanced security implementation
- Performance at scale
- Advanced monitoring
- Enterprise patterns
- Team collaboration tools
- Advanced CI/CD
- Advanced analytics
- Enterprise error tracking
- Scalability patterns
- Advanced deployment
- System documentation
- Architecture decision records

---

*Each question includes complete Vue.js 3 Composition API solutions with modern patterns and best practices.*





