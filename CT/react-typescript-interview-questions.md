# React TypeScript - 100 Coding Interview Questions

## Junior Level (25 questions)

### 1. Typed Component with Props Interface ⭐
**Time:** 15 minutes  
**Tests:** TypeScript interfaces, component props typing, type safety

**Challenge:**
```typescript
// Create a UserCard component that accepts props: name (string), age (number), email (string), and isActive (boolean).
// Define a proper TypeScript interface for the props.
// Display all information. Show "Active" badge if isActive is true.
// Make email optional. Handle undefined email case.
```

**What interviewers look for:**
```typescript
import React from 'react';

interface UserCardProps {
  name: string;
  age: number;
  email?: string; // Optional
  isActive: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ name, age, email, isActive }) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '300px',
      backgroundColor: isActive ? '#f0f8f0' : '#f5f5f5'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>{name}</h3>
        {isActive && (
          <span style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            Active
          </span>
        )}
      </div>
      <div style={{ marginBottom: '5px' }}>Age: {age}</div>
      <div>{email ? `Email: ${email}` : 'No email provided'}</div>
    </div>
  );
};

export default UserCard;

// Usage:
// <UserCard name="John Doe" age={30} email="john@example.com" isActive={true} />
// <UserCard name="Jane Smith" age={25} isActive={false} />
```

### 2. Typed Event Handlers ⭐
**Time:** 15 minutes  
**Tests:** Event type definitions, form event handling, type inference

**Challenge:**
```typescript
// Create a form with name and email inputs.
// Properly type the onChange and onSubmit event handlers.
// Create a typed state interface. Show submitted data below form.
// Prevent default form submission.
```

**What interviewers look for:**
```typescript
import React, { useState, FormEvent, ChangeEvent } from 'react';

interface FormData {
  name: string;
  email: string;
}

const TypedForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: ''
  });
  const [submitted, setSubmitted] = useState<FormData | null>(null);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSubmitted({ ...formData });
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>
          Submit
        </button>
      </form>
      
      {submitted && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
          <h4>Submitted Data:</h4>
          <div>Name: {submitted.name}</div>
          <div>Email: {submitted.email}</div>
        </div>
      )}
    </div>
  );
};

export default TypedForm;
```

### 3. Generic List Component ⭐
**Time:** 20 minutes  
**Tests:** Generics, type parameters, reusable components

**Challenge:**
```typescript
// Create a generic List component that can render any type of items.
// Accept items array and renderItem function as props.
// Properly type the generic. Use it to render both User and Product lists.
```

**What interviewers look for:**
```typescript
import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>): JSX.Element {
  return (
    <div>
      {items.map(item => (
        <div key={keyExtractor(item)} style={{ marginBottom: '10px' }}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

const GenericListExample: React.FC = () => {
  const users: User[] = [
    { id: 1, name: 'John', email: 'john@example.com' },
    { id: 2, name: 'Jane', email: 'jane@example.com' }
  ];
  
  const products: Product[] = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 699 }
  ];
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Users</h2>
      <List
        items={users}
        keyExtractor={(user) => user.id}
        renderItem={(user) => (
          <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
            <div><strong>{user.name}</strong></div>
            <div>{user.email}</div>
          </div>
        )}
      />
      
      <h2 style={{ marginTop: '30px' }}>Products</h2>
      <List
        items={products}
        keyExtractor={(product) => product.id}
        renderItem={(product) => (
          <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
            <div><strong>{product.name}</strong></div>
            <div>${product.price}</div>
          </div>
        )}
      />
    </div>
  );
};

export default GenericListExample;
```

### 4. Typed Custom Hook ⭐
**Time:** 20 minutes  
**Tests:** Custom hooks, return types, generic hooks

**Challenge:**
```typescript
// Create a typed custom hook useLocalStorage that:
// - Accepts a key (string) and initial value (generic type)
// - Returns [value, setValue] tuple with proper types
// - Persists to localStorage
// - Handles JSON serialization/deserialization
// - Returns initial value if localStorage is empty
```

**What interviewers look for:**
```typescript
import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue];
}

// Usage example:
const TypedLocalStorageExample: React.FC = () => {
  const [name, setName] = useLocalStorage<string>('name', '');
  const [count, setCount] = useLocalStorage<number>('count', 0);
  const [user, setUser] = useLocalStorage<{ id: number; name: string } | null>('user', null);
  
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <span>Stored name: {name || '(empty)'}</span>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <span style={{ marginLeft: '10px' }}>Count: {count}</span>
      </div>
      
      <div>
        <button onClick={() => setUser({ id: 1, name: 'John' })}>Set User</button>
        <button onClick={() => setUser(null)} style={{ marginLeft: '10px' }}>Clear User</button>
        <div style={{ marginTop: '10px' }}>
          User: {user ? `${user.name} (ID: ${user.id})` : 'None'}
        </div>
      </div>
    </div>
  );
};

export default TypedLocalStorageExample;
```

### 5. Union Types and Discriminated Unions ⭐
**Time:** 25 minutes  
**Tests:** Union types, type narrowing, discriminated unions

**Challenge:**
```typescript
// Create a component that handles different notification types:
// - Success: message, duration
// - Error: message, errorCode
// - Warning: message
// - Info: message, link (optional)
// Use discriminated union. Render appropriate UI for each type.
```

**What interviewers look for:**
```typescript
import React from 'react';

type SuccessNotification = {
  type: 'success';
  message: string;
  duration: number;
};

type ErrorNotification = {
  type: 'error';
  message: string;
  errorCode: number;
};

type WarningNotification = {
  type: 'warning';
  message: string;
};

type InfoNotification = {
  type: 'info';
  message: string;
  link?: string;
};

type Notification = SuccessNotification | ErrorNotification | WarningNotification | InfoNotification;

interface NotificationProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationComponent: React.FC<NotificationProps> = ({ notification, onClose }) => {
  const getColor = (): string => {
    switch (notification.type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'info':
        return '#2196F3';
    }
  };
  
  const getIcon = (): string => {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
    }
  };
  
  return (
    <div style={{
      padding: '15px',
      backgroundColor: getColor(),
      color: 'white',
      borderRadius: '5px',
      marginBottom: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '20px' }}>{getIcon()}</span>
        <div>
          <div>{notification.message}</div>
          {notification.type === 'success' && (
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              Duration: {notification.duration}ms
            </div>
          )}
          {notification.type === 'error' && (
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              Error Code: {notification.errorCode}
            </div>
          )}
          {notification.type === 'info' && notification.link && (
            <a href={notification.link} style={{ color: 'white', textDecoration: 'underline' }}>
              Learn more
            </a>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '0 10px'
        }}
      >
        ×
      </button>
    </div>
  );
};

const NotificationExample: React.FC = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
  };
  
  const removeNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => addNotification({
          type: 'success',
          message: 'Operation completed successfully!',
          duration: 3000
        })}>
          Add Success
        </button>
        <button onClick={() => addNotification({
          type: 'error',
          message: 'Something went wrong',
          errorCode: 500
        })}>
          Add Error
        </button>
        <button onClick={() => addNotification({
          type: 'warning',
          message: 'Please review your input'
        })}>
          Add Warning
        </button>
        <button onClick={() => addNotification({
          type: 'info',
          message: 'New feature available',
          link: 'https://example.com'
        })}>
          Add Info
        </button>
      </div>
      
      {notifications.map((notification, index) => (
        <NotificationComponent
          key={index}
          notification={notification}
          onClose={() => removeNotification(index)}
        />
      ))}
    </div>
  );
};

export default NotificationExample;
```

### 6-25. [Additional Junior TypeScript Questions covering:]
- Ref typing (useRef with proper types)
- Children typing (React.ReactNode)
- Component return types
- Type guards and assertions
- Readonly types
- Partial and Required utility types
- Pick and Omit utility types
- Record type
- Function overloads
- Const assertions
- Template literal types
- Mapped types
- Conditional types basics
- Type narrowing with typeof/instanceof
- Index signatures
- Optional chaining and nullish coalescing
- Type assertions (as vs angle brackets)
- Type vs Interface differences
- Enums (string and numeric)
- Namespace declarations
- Module augmentation
- Declaration merging

---

## Mid Level (35 questions)

### 26. Advanced Generic Components ⭐⭐
**Time:** 30 minutes  
**Tests:** Advanced generics, constraints, conditional types

**Challenge:**
```typescript
// Create a DataTable component with:
// - Generic row type
// - Configurable columns with typed render functions
// - Sorting by any column
// - Filtering with typed filter functions
// - Proper type inference for all operations
```

### 27. Type-Safe API Client ⭐⭐
**Time:** 35 minutes  
**Tests:** Generic functions, async types, error handling types

**Challenge:**
```typescript
// Create a type-safe API client that:
// - Accepts endpoint URLs and request/response types
// - Handles GET, POST, PUT, DELETE with proper typing
// - Returns typed responses or typed errors
// - Supports query parameters and request bodies
```

### 28-60. [Additional Mid Level Questions covering:]
- Advanced custom hooks with generics
- Context API with TypeScript
- Higher-order components with types
- Render props pattern with types
- Error boundaries with typed errors
- Code splitting with typed lazy loading
- Form libraries with TypeScript (Formik, React Hook Form)
- API integration with typed responses
- Authentication with typed tokens
- Protected routes with typed guards
- Advanced memoization with types
- Type-safe routing
- Type-safe state management (Redux, Zustand)
- Type-safe WebSocket connections
- Advanced utility types (Exclude, Extract, NonNullable)
- Branded types
- Phantom types
- Type-level programming
- Advanced conditional types
- Distributive conditional types
- Template literal type manipulation
- Recursive types
- Type-safe event emitters
- Type-safe plugin systems

---

## Senior Level (25 questions)

### 61. Advanced Type System Patterns ⭐⭐⭐
**Time:** 60 minutes  
**Tests:** Complex type manipulation, type-level computation

**Challenge:**
```typescript
// Create a type-safe form builder where:
// - Form schema is defined with types
// - Form values are inferred from schema
// - Validation rules are type-checked
// - Errors are typed per field
// - All operations are type-safe at compile time
```

### 62. Type-Safe State Machine ⭐⭐⭐
**Time:** 75 minutes  
**Tests:** Advanced TypeScript, state management, type safety

**Challenge:**
```typescript
// Implement a type-safe finite state machine where:
// - States and transitions are defined with types
// - Only valid transitions are allowed (compile-time)
// - Context is typed per state
// - Actions are type-safe
// - TypeScript prevents invalid state transitions
```

### 63-85. [Additional Senior Questions covering:]
- Advanced generic constraints
- Recursive type definitions
- Type-level arithmetic
- Complex mapped types
- Template literal type manipulation
- Type-safe DSL creation
- Advanced conditional types
- Type inference optimization
- Performance with complex types
- Type-safe serialization
- Advanced utility type creation
- Type-safe dependency injection
- Advanced pattern matching with types
- Type-safe code generation
- Advanced module system
- Type-safe metaprogramming
- Complex type guards
- Advanced assertion signatures
- Type-safe reflection
- Type-level testing

---

## Lead Level (15 questions)

### 86. Type-Safe Architecture Patterns ⭐⭐⭐⭐
**Time:** 120 minutes  
**Tests:** System design, type system architecture, enterprise patterns

**Challenge:**
```typescript
// Design a type-safe micro-frontend architecture where:
// - Each module exports typed interfaces
// - Shared contracts are type-checked
// - Version compatibility is type-enforced
// - Module federation is type-safe
// - All integrations are compile-time verified
```

### 87-100. [Additional Lead Questions covering:]
- Type-safe plugin architecture
- Advanced type system design
- Type-safe distributed systems
- Enterprise type patterns
- Advanced type inference systems
- Type-safe code generation pipelines
- Complex type system optimizations
- Type-safe architecture documentation
- Advanced type system tooling
- Type-safe migration strategies
- Enterprise-grade type safety
- Advanced type system patterns
- Type-safe system integration
- Type system performance optimization

---

*Each question includes complete TypeScript solutions with proper typing, type safety, and best practices.*





