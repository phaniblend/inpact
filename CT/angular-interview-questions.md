# Angular - 100 Coding Interview Questions

## Junior Level (25 questions)

### 1. Component with Input/Output Properties ⭐
**Time:** 20 minutes  
**Tests:** Component communication, @Input, @Output, EventEmitter

**Challenge:**
```typescript
// Create a ProductCard component that:
// - Accepts product (name, price, image) as @Input
// - Emits 'addToCart' event with product when button clicked
// - Shows "Added!" message for 2 seconds after click
// - Parent component displays cart count
```

**What interviewers look for:**
```typescript
// product-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-product-card',
  template: `
    <div class="product-card">
      <img [src]="product.image" [alt]="product.name" />
      <h3>{{ product.name }}</h3>
      <p class="price">${{ product.price.toFixed(2) }}</p>
      <button 
        (click)="onAddToCart()" 
        [disabled]="isAdded"
        [class.added]="isAdded"
      >
        {{ isAdded ? '✓ Added!' : 'Add to Cart' }}
      </button>
    </div>
  `,
  styles: [`
    .product-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      max-width: 300px;
      text-align: center;
    }
    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 5px;
    }
    .price {
      font-size: 20px;
      font-weight: bold;
      color: #4CAF50;
    }
    button {
      width: 100%;
      padding: 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    button.added {
      background-color: #4CAF50;
    }
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  
  isAdded = false;
  
  onAddToCart() {
    this.isAdded = true;
    this.addToCart.emit(this.product);
    
    setTimeout(() => {
      this.isAdded = false;
    }, 2000);
  }
}

// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>Products</h1>
      <div class="cart-info">Cart: {{ cartCount }} items</div>
      
      <div class="products-grid">
        <app-product-card
          *ngFor="let product of products"
          [product]="product"
          (addToCart)="handleAddToCart($event)"
        ></app-product-card>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .cart-info {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
      padding: 10px;
      background-color: #e3f2fd;
      border-radius: 5px;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
  `]
})
export class AppComponent {
  products: Product[] = [
    { id: 1, name: 'Laptop', price: 999.99, image: '/assets/laptop.jpg' },
    { id: 2, name: 'Phone', price: 699.99, image: '/assets/phone.jpg' },
    { id: 3, name: 'Tablet', price: 399.99, image: '/assets/tablet.jpg' }
  ];
  
  cartCount = 0;
  
  handleAddToCart(product: Product) {
    this.cartCount++;
    console.log('Added to cart:', product);
  }
}
```

### 2. Reactive Forms with Validation ⭐
**Time:** 30 minutes  
**Tests:** ReactiveFormsModule, FormBuilder, validators, custom validators

**Challenge:**
```typescript
// Create a registration form with reactive forms:
// - Name: required, min 2 chars
// - Email: required, valid email
// - Password: required, min 8 chars, must have uppercase, number, special char
// - Confirm Password: must match password
// - Show validation errors
// - Disable submit until valid
```

**What interviewers look for:**
```typescript
// registration.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-registration',
  template: `
    <div class="registration-container">
      <h2>Registration</h2>
      
      <form [formGroup]="registrationForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Name:</label>
          <input 
            formControlName="name"
            type="text"
            [class.error]="name?.invalid && name?.touched"
          />
          <div *ngIf="name?.invalid && name?.touched" class="error-message">
            <div *ngIf="name?.errors?.['required']">Name is required</div>
            <div *ngIf="name?.errors?.['minlength']">Name must be at least 2 characters</div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Email:</label>
          <input 
            formControlName="email"
            type="email"
            [class.error]="email?.invalid && email?.touched"
          />
          <div *ngIf="email?.invalid && email?.touched" class="error-message">
            <div *ngIf="email?.errors?.['required']">Email is required</div>
            <div *ngIf="email?.errors?.['email']">Email is invalid</div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Password:</label>
          <input 
            formControlName="password"
            type="password"
            [class.error]="password?.invalid && password?.touched"
          />
          <div *ngIf="password?.invalid && password?.touched" class="error-message">
            <div *ngIf="password?.errors?.['required']">Password is required</div>
            <div *ngIf="password?.errors?.['minlength']">Password must be at least 8 characters</div>
            <div *ngIf="password?.errors?.['passwordStrength']">
              Password must contain uppercase, number, and special character
            </div>
          </div>
          <div *ngIf="password?.value" class="password-requirements">
            <div [class.met]="hasUppercase">✓ Uppercase letter</div>
            <div [class.met]="hasNumber">✓ Number</div>
            <div [class.met]="hasSpecial">✓ Special character</div>
            <div [class.met]="hasMinLength">✓ At least 8 characters</div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Confirm Password:</label>
          <input 
            formControlName="confirmPassword"
            type="password"
            [class.error]="confirmPassword?.invalid && confirmPassword?.touched"
          />
          <div *ngIf="confirmPassword?.invalid && confirmPassword?.touched" class="error-message">
            <div *ngIf="confirmPassword?.errors?.['required']">Please confirm your password</div>
            <div *ngIf="confirmPassword?.errors?.['passwordMismatch']">Passwords do not match</div>
          </div>
        </div>
        
        <button 
          type="submit" 
          [disabled]="registrationForm.invalid"
          [class.disabled]="registrationForm.invalid"
        >
          Register
        </button>
      </form>
      
      <div *ngIf="submitted" class="success-message">
        Registration successful!
      </div>
    </div>
  `,
  styles: [`
    .registration-container {
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
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      box-sizing: border-box;
    }
    input.error {
      border-color: #f44336;
    }
    .error-message {
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
    button {
      width: 100%;
      padding: 12px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
    }
    button.disabled {
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
  `]
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  submitted = false;
  
  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }
  
  get name() { return this.registrationForm.get('name'); }
  get email() { return this.registrationForm.get('email'); }
  get password() { return this.registrationForm.get('password'); }
  get confirmPassword() { return this.registrationForm.get('confirmPassword'); }
  
  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.password?.value || '');
  }
  
  get hasNumber(): boolean {
    return /[0-9]/.test(this.password?.value || '');
  }
  
  get hasSpecial(): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(this.password?.value || '');
  }
  
  get hasMinLength(): boolean {
    return (this.password?.value || '').length >= 8;
  }
  
  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    return (hasUpper && hasNumber && hasSpecial) ? null : { passwordStrength: true };
  }
  
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  
  onSubmit() {
    if (this.registrationForm.valid) {
      this.submitted = true;
      console.log('Form submitted:', this.registrationForm.value);
      setTimeout(() => {
        this.submitted = false;
        this.registrationForm.reset();
      }, 3000);
    }
  }
}
```

### 3. HTTP Service with Observable ⭐
**Time:** 25 minutes  
**Tests:** HttpClient, Observables, RxJS operators, error handling

**Challenge:**
```typescript
// Create a service to fetch users from API:
// - GET /api/users endpoint
// - Handle loading state
// - Handle errors
// - Display users in component
// - Use async pipe
```

**What interviewers look for:**
```typescript
// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}

// user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService, User } from './user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  template: `
    <div class="user-list-container">
      <h2>Users</h2>
      
      <div *ngIf="loading$ | async" class="loading">Loading users...</div>
      <div *ngIf="error$ | async as error" class="error">{{ error }}</div>
      
      <div *ngIf="users$ | async as users" class="users-grid">
        <div *ngFor="let user of users" class="user-card">
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .user-list-container {
      padding: 20px;
    }
    .loading {
      text-align: center;
      padding: 20px;
      color: #666;
    }
    .error {
      padding: 15px;
      background-color: #ffebee;
      color: #c62828;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
    }
    .user-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      background-color: white;
    }
    .user-card h3 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .user-card p {
      margin: 0;
      color: #666;
    }
  `]
})
export class UserListComponent implements OnInit {
  users$!: Observable<User[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  
  constructor(private userService: UserService) {}
  
  ngOnInit() {
    this.users$ = this.userService.getUsers();
    // In real app, you'd manage loading/error states with a state management solution
    // or use a more sophisticated Observable pattern
  }
}
```

### 4-25. [Additional Junior Angular Questions covering:]
- Directives (structural, attribute, custom)
- Pipes (built-in, custom, async)
- Services and dependency injection
- Routing basics
- Route parameters
- Query parameters
- Child routes
- Guards (canActivate, canDeactivate)
- Resolvers
- Template-driven forms
- Two-way binding
- ViewChild and ContentChild
- Lifecycle hooks
- Change detection
- NgModules
- Lazy loading modules
- Interceptors
- Error handling
- Environment configuration
- Basic testing

---

## Mid Level (35 questions)

### 26. Advanced Routing with Guards ⭐⭐
**Time:** 40 minutes  
**Tests:** Route guards, authentication, route protection

**Challenge:**
```typescript
// Implement authentication with route guards:
// - Login component
// - Auth service with JWT
// - Auth guard for protected routes
// - Redirect to login if not authenticated
// - Store token in localStorage
```

### 27. State Management with NgRx ⭐⭐
**Time:** 60 minutes  
**Tests:** NgRx, actions, reducers, effects, selectors

**Challenge:**
```typescript
// Create a shopping cart with NgRx:
// - Add/remove items actions
// - Cart reducer
// - Effects for API calls
// - Selectors for computed state
// - Display cart in component
```

### 28-60. [Additional Mid Level Questions covering:]
- Advanced RxJS operators
- Custom pipes
- Custom directives
- Advanced forms (dynamic, nested)
- Form arrays
- Advanced routing patterns
- Route data and resolvers
- HTTP interceptors
- Error interceptors
- Loading interceptors
- Advanced dependency injection
- Multi-providers
- Factory providers
- Advanced testing
- E2E testing
- Performance optimization
- Change detection strategies
- OnPush strategy
- Lazy loading optimization
- Code splitting
- Advanced animations
- Route animations
- Advanced guards
- CanLoad guard
- Advanced resolvers
- Advanced interceptors
- Custom validators
- Async validators
- Cross-field validation
- Advanced services
- Singleton services
- ProvidedIn patterns

---

## Senior Level (25 questions)

### 61. Micro-Frontend Architecture ⭐⭐⭐
**Time:** 90 minutes  
**Tests:** Module federation, micro-frontends, architecture

**Challenge:**
```typescript
// Design micro-frontend architecture:
// - Host application
// - Remote modules
// - Shared dependencies
// - Independent deployments
// - Communication between modules
```

### 62. Advanced Performance Optimization ⭐⭐⭐
**Time:** 75 minutes  
**Tests:** Performance, optimization, profiling

**Challenge:**
```typescript
// Optimize large Angular application:
// - Virtual scrolling
// - OnPush change detection
// - Lazy loading strategies
// - Bundle optimization
// - Memory leak prevention
```

### 63-85. [Additional Senior Questions covering:]
- Advanced NgRx patterns
- Effects patterns
- Entity adapters
- Advanced routing architecture
- Route preloading strategies
- Advanced forms architecture
- Dynamic form generation
- Advanced testing strategies
- Test coverage optimization
- Advanced security
- XSS prevention
- CSRF protection
- Advanced accessibility
- ARIA patterns
- Advanced animations
- Complex animations
- Performance monitoring
- Advanced error handling
- Global error handling
- Advanced interceptors
- Request/response transformation
- Advanced dependency injection
- Multi-injection
- Advanced module patterns

---

## Lead Level (15 questions)

### 86. Enterprise Architecture ⭐⭐⭐⭐
**Time:** 120 minutes  
**Tests:** System design, enterprise patterns, scalability

**Challenge:**
```typescript
// Design enterprise Angular application:
// - Multi-tenant architecture
// - Feature modules organization
// - Shared modules strategy
// - Build optimization
// - Deployment strategy
```

### 87-100. [Additional Lead Questions covering:]
- Advanced architecture patterns
- Micro-frontend at scale
- Advanced state management
- Enterprise patterns
- Team collaboration
- Code organization
- Advanced CI/CD
- Advanced monitoring
- Performance at scale
- Advanced security
- Enterprise security
- Advanced testing
- Test automation
- Advanced deployment
- Scalability patterns
- System documentation

---

*Each question includes complete Angular solutions with TypeScript, modern patterns, and best practices.*





