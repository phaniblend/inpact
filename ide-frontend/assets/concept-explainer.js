/**
 * ICL (Interactive Concept Learning) - Interactive learning tool for programming concepts
 * Single-file component that reads JSON configs and renders interactive screens
 */

class ICL {
  constructor(containerId, conceptId) {
    this.container = document.getElementById(containerId);
    this.conceptId = conceptId;
    this.currentScreen = 0;
    this.config = null;
    this.builderItems = []; // Store items for builder screen
  }

  async init() {
    try {
      // Load the JSON config
      const response = await fetch(`/concepts/${this.conceptId}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load concept: ${response.statusText}`);
      }
      this.config = await response.json();
      this.renderScreen();
    } catch (error) {
      console.error('Failed to load concept:', error);
      this.container.innerHTML = `
        <div class="concept-error" style="padding: 2rem; text-align: center; color: #e5e7eb;">
          <h2 style="color: #ef4444; margin-bottom: 1rem;">Concept Not Available</h2>
          <p style="margin-bottom: 1.5rem;">The interactive lesson for "${this.conceptId}" is not available yet.</p>
          <p style="margin-bottom: 1.5rem; color: #cbd5e1; font-size: 0.9rem;">We're working on adding more interactive lessons. For now, please use the other learning options like "Read official docs" or "I have a specific question".</p>
          <button id="close-btn" class="btn btn-primary">Close</button>
        </div>
      `;
      document.getElementById('close-btn')?.addEventListener('click', () => this.close());
    }
  }

  renderScreen() {
    const screen = this.config.screens[this.currentScreen];
    if (!screen) {
      this.finish();
      return;
    }

    // Build HTML based on screen type
    let html = this.buildScreenHTML(screen);

    // Add navigation buttons
    html += this.buildNavigation();

    // Update DOM
    this.container.innerHTML = html;

    // Attach event listeners
    this.attachEventListeners();
  }

  buildScreenHTML(screen) {
    // Use a switch to handle different screen types
    switch (screen.type) {
      case 'intro':
        return this.buildIntroScreen(screen);
      case 'builder':
        return this.buildBuilderScreen(screen);
      case 'quiz':
        return this.buildQuizScreen(screen);
      default:
        return '<p>Unknown screen type</p>';
    }
  }

  buildIntroScreen(screen) {
    return `
      <div class="concept-screen intro-screen">
        <h2>${this.escapeHtml(screen.title)}</h2>
        ${screen.analogy ? `<p class="analogy">${this.escapeHtml(screen.analogy)}</p>` : ''}
        ${screen.code ? `<pre class="code-block"><code>${this.escapeHtml(screen.code)}</code></pre>` : ''}
        ${this.buildVisual(screen.visual)}
        ${screen.tip ? `<div class="pro-tip">💡 ${this.escapeHtml(screen.tip)}</div>` : ''}
      </div>
    `;
  }

  buildBuilderScreen(screen) {
    return `
      <div class="concept-screen builder-screen">
        <h2>${this.escapeHtml(screen.title)}</h2>
        ${screen.instructions ? `<p>${this.escapeHtml(screen.instructions)}</p>` : ''}
        <div class="builder-controls">
          <input type="text" id="array-input" placeholder="${this.escapeHtml(screen.placeholder || 'Type an item')}" />
          <button id="add-item" class="btn btn-primary">Add Item</button>
        </div>
        <div id="array-preview" class="array-preview"></div>
        ${screen.examples && screen.examples.length > 0 ? `
          <div class="suggestions">
            <p>Try:</p>
            ${screen.examples.map(ex => `<code>${this.escapeHtml(ex)}</code>`).join(' • ')}
          </div>
        ` : ''}
      </div>
    `;
  }

  buildQuizScreen(screen) {
    return `
      <div class="concept-screen quiz-screen">
        <h2>${this.escapeHtml(screen.title)}</h2>
        ${screen.context ? `
          <div class="quiz-context">
            <pre><code>${this.escapeHtml(screen.context)}</code></pre>
          </div>
        ` : ''}
        <p class="question">${this.escapeHtml(screen.question)}</p>
        <div class="options">
          ${screen.options.map((opt, i) =>
            `<button class="option-btn" data-index="${i}">${this.escapeHtml(opt)}</button>`
          ).join('')}
        </div>
        <div id="feedback" class="feedback hidden"></div>
      </div>
    `;
  }

  buildVisual(visual) {
    if (!visual) return '';

    if (visual.type === 'array-boxes') {
      return `
        <div class="array-boxes">
          ${visual.items.map((item, i) => `
            <div class="array-box">
              <div class="box-value">${this.escapeHtml(String(item))}</div>
              <div class="box-index">[${i}]</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    return '';
  }

  buildNavigation() {
    const isFirst = this.currentScreen === 0;
    const isLast = this.currentScreen === this.config.screens.length - 1;

    return `
      <div class="navigation">
        <button id="prev-btn" class="btn" ${isFirst ? 'disabled' : ''}>← Previous</button>
        <span class="progress">${this.currentScreen + 1} / ${this.config.screens.length}</span>
        <button id="next-btn" class="btn btn-primary">${isLast ? 'Finish' : 'Next →'}</button>
      </div>
    `;
  }

  attachEventListeners() {
    const screen = this.config.screens[this.currentScreen];
    if (!screen) return;

    // Navigation
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previous());
    }

    // Screen-specific listeners
    if (screen.type === 'builder') {
      this.attachBuilderListeners();
    } else if (screen.type === 'quiz') {
      this.attachQuizListeners(screen);
    }
  }

  attachBuilderListeners() {
    const input = document.getElementById('array-input');
    const addBtn = document.getElementById('add-item');
    const preview = document.getElementById('array-preview');

    if (!input || !addBtn || !preview) return;

    // Reset builder items for this screen
    this.builderItems = [];

    const addItem = () => {
      const value = input.value.trim();
      if (value) {
        this.builderItems.push(value);
        input.value = '';
        input.focus();
        this.updateArrayPreview(preview, this.builderItems);
      }
    };

    addBtn.addEventListener('click', addItem);

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addItem();
      }
    });

    // Focus input on mount
    input.focus();
  }

  attachQuizListeners(screen) {
    const options = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('feedback');

    if (!options.length || !feedback) return;

    options.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const isCorrect = index === screen.correctIndex;

        // Disable all buttons
        options.forEach(b => {
          b.disabled = true;
          b.classList.remove('correct', 'incorrect');
        });

        // Show feedback
        btn.classList.add(isCorrect ? 'correct' : 'incorrect');
        feedback.textContent = isCorrect
          ? (screen.correctFeedback || '✅ Correct!')
          : (screen.incorrectFeedback || '❌ Try again!');
        feedback.classList.remove('hidden');
        feedback.classList.add(isCorrect ? 'success' : 'error');
      });
    });
  }

  updateArrayPreview(container, items) {
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = '<p class="empty-preview">Add items to see your array...</p>';
      return;
    }

    // Try to parse items as numbers or keep as strings
    const formattedItems = items.map(item => {
      const num = Number(item);
      if (!isNaN(num) && item.trim() !== '') {
        return num;
      }
      return `"${item}"`;
    });

    container.innerHTML = `
      <div class="array-boxes">
        ${items.map((item, i) => `
          <div class="array-box">
            <div class="box-value">${this.escapeHtml(String(item))}</div>
            <div class="box-index">[${i}]</div>
          </div>
        `).join('')}
      </div>
      <pre class="code-result">let myArray = [${formattedItems.join(', ')}];</pre>
    `;
  }

  next() {
    if (this.currentScreen < this.config.screens.length - 1) {
      this.currentScreen++;
      this.renderScreen();
    } else {
      this.finish();
    }
  }

  previous() {
    if (this.currentScreen > 0) {
      this.currentScreen--;
      this.renderScreen();
    }
  }

  finish() {
    // Close modal or show completion message
    this.container.innerHTML = `
      <div class="completion-screen">
        <h2>🎉 Great job!</h2>
        <p>You've completed the ${this.escapeHtml(this.config.title)} lesson.</p>
        <button id="close-btn" class="btn btn-primary">Close</button>
      </div>
    `;

    document.getElementById('close-btn')?.addEventListener('click', () => {
      this.close();
    });
  }

  close() {
    // Remove modal or hide container
    const modal = this.container.closest('.concept-modal');
    if (modal) {
      modal.remove();
    } else {
      // Fallback: hide the container
      this.container.style.display = 'none';
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/**
 * Helper function to show concept explainer modal
 */
function showICL(conceptId) {
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'concept-modal';
  modal.innerHTML = '<div class="concept-container" id="concept-container"></div>';
  document.body.appendChild(modal);

  // Initialize ICL
  const icl = new ICL('concept-container', conceptId);
  icl.init();

  // Allow closing by clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Allow closing with Escape key
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
}
