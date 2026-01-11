"""
Script to generate 100 real, specific coding interview questions for React JavaScript
Each question must be SPECIFIC and REAL - not generic placeholders
"""

questions = {
    "junior": [
        {
            "title": "Traffic Light Component",
            "time": 15,
            "tests": "State management, event handling, conditional rendering",
            "challenge": """Create a traffic light component with three circles (red, yellow, green).
When you click a button, cycle through the lights: red → yellow → green → red.
Only one light should be 'on' (bright) at a time, others should be dim (opacity 0.3).
Display current state text below (e.g., "Red Light - Stop")""",
            "solution": "Full working code with useState, event handlers, and conditional styling"
        },
        {
            "title": "Password Strength Checker",
            "time": 20,
            "tests": "Form handling, real-time validation, conditional styling",
            "challenge": """Build a password strength checker. As the user types their password, show a meter (Weak/Medium/Strong)
based on: length >= 8 chars, has uppercase, has number, has special character.
Display which requirements are met/unmet with checkmarks/X marks.
Show strength bar that changes color (red/amber/green)""",
            "solution": "Full working code with regex validation, real-time updates, and visual feedback"
        }
        # ... more questions would be added here
    ]
}

# This is a template - the actual questions will be in the markdown files
print("Question generation template created")





