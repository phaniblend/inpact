const form = document.getElementById('objectivesForm');
const taskInput = document.getElementById('task');
const techInput = document.getElementById('tech');
const submitBtn = document.getElementById('submitBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const objectivesContent = document.getElementById('objectivesContent');
const error = document.getElementById('error');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const task = taskInput.value.trim();
    const tech = techInput.value.trim();
    
    if (!task || !tech) {
        showError('Please fill in both fields');
        return;
    }
    
    // Reset UI
    hideError();
    hideResults();
    showLoading();
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/objectives', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task, tech })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showResults(data.objectives);
        } else {
            showError(data.error || 'Failed to generate objectives');
        }
    } catch (err) {
        showError('Network error. Please check your connection and try again.');
        console.error('Error:', err);
    } finally {
        hideLoading();
        submitBtn.disabled = false;
    }
});

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showResults(objectives) {
    objectivesContent.textContent = objectives;
    results.classList.remove('hidden');
}

function hideResults() {
    results.classList.add('hidden');
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}