// APT Learn - Shared JavaScript Utilities

/**
 * Navigate to a route
 */
function navigate(path) {
  window.location.href = path;
}

/**
 * Get URL parameter by name
 */
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * Get lessonId from URL path /learn/:lessonId
 */
function getLessonIdFromPath() {
  const path = window.location.pathname;
  const match = path.match(/^\/learn\/([^\/]+)/);
  return match ? match[1] : null;
}

/**
 * Save email to localStorage
 */
function saveEmail(email) {
  if (email) {
    localStorage.setItem('apt_email', email);
  }
}

/**
 * Get email from localStorage
 */
function getEmail() {
  return localStorage.getItem('apt_email') || '';
}

/**
 * Send email to backend session endpoint
 */
async function updateSession(email) {
  try {
    await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  } catch (err) {
    console.error('Failed to update session:', err);
  }
}

