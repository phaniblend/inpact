#!/usr/bin/env python3
"""
Generate Bloom's Taxonomy Level 3 (Application) Learning Objectives for all challenges.

This script generates proper learning objectives using only Level 3 verbs:
- create, implement, apply, use, update, execute, render, bind, run, verify
"""

import json
import os
import re
from pathlib import Path

# Bloom's Level 3 verbs (Application)
LEVEL_3_VERBS = [
    'create', 'implement', 'apply', 'use', 'update', 'execute', 
    'render', 'bind', 'run', 'verify', 'build', 'construct',
    'develop', 'generate', 'produce', 'write', 'code', 'configure'
]

# Technology-specific patterns for generating objectives
OBJECTIVE_TEMPLATES = {
    'react': {
        'component': [
            'Create a React functional component that {action}.',
            'Implement state management using {hook}.',
            'Apply event handlers to {interaction}.',
            'Use JSX to {jsx_action}.',
            'Render {element} within the component output.',
            'Run the component and verify {verification}.'
        ],
        'hook': [
            'Create a custom React hook that {action}.',
            'Implement {hook_type} logic using React hooks.',
            'Apply the hook to {use_case}.',
            'Use the hook in a functional component.',
            'Verify the hook behavior in the browser.'
        ],
        'form': [
            'Create a React form component that {action}.',
            'Implement form state management using {state_method}.',
            'Apply validation logic to {validation_target}.',
            'Use controlled inputs to {input_action}.',
            'Handle form submission and verify {verification}.'
        ]
    },
    'nodejs': {
        'api': [
            'Create an Express API endpoint that {action}.',
            'Implement request handling for {request_type}.',
            'Apply middleware to {middleware_action}.',
            'Use Express routing to {routing_action}.',
            'Test the endpoint and verify {verification}.'
        ],
        'middleware': [
            'Create custom middleware that {action}.',
            'Implement middleware logic for {purpose}.',
            'Apply the middleware to {route_pattern}.',
            'Use middleware to {middleware_use}.',
            'Verify middleware execution in the request cycle.'
        ]
    },
    'python': {
        'api': [
            'Create a Flask API endpoint that {action}.',
            'Implement route handling for {route_type}.',
            'Apply request parsing to {data_type}.',
            'Use Flask decorators to {decorator_action}.',
            'Test the endpoint and verify {verification}.'
        ],
        'function': [
            'Create a Python function that {action}.',
            'Implement {functionality} logic.',
            'Apply the function to {use_case}.',
            'Use the function with {input_type}.',
            'Run the function and verify {verification}.'
        ]
    }
}

def extract_topic_from_title(title, technology):
    """Extract the main topic/component from the title."""
    # Remove common prefixes
    title = title.replace(f'{technology} ', '').strip()
    
    # Common patterns
    if 'component' in title.lower():
        return 'component'
    elif 'hook' in title.lower():
        return 'hook'
    elif 'form' in title.lower():
        return 'form'
    elif 'api' in title.lower() or 'endpoint' in title.lower():
        return 'api'
    elif 'middleware' in title.lower():
        return 'middleware'
    else:
        return 'component'  # default

def generate_objectives(title, technology, tests, domain):
    """Generate Bloom's Level 3 learning objectives."""
    
    # Extract key concepts from tests/metadata
    tests_lower = tests.lower() if tests else ''
    
    # Determine topic type
    topic_type = extract_topic_from_title(title, technology)
    
    # Get technology-specific templates
    tech_templates = OBJECTIVE_TEMPLATES.get(domain, OBJECTIVE_TEMPLATES.get('react', {}))
    templates = tech_templates.get(topic_type, tech_templates.get('component', []))
    
    # Extract specific technologies/concepts from tests
    hooks = []
    if 'usestate' in tests_lower:
        hooks.append('useState')
    if 'useeffect' in tests_lower:
        hooks.append('useEffect')
    if 'usecallback' in tests_lower:
        hooks.append('useCallback')
    if 'usememo' in tests_lower:
        hooks.append('useMemo')
    
    # Generate objectives based on title and tests
    objectives = []
    
    if domain == 'react' or domain == 'react-typescript':
        # React-specific objectives
        if 'counter' in title.lower():
            objectives = [
                "Create a React functional component that displays a numeric counter value.",
                "Implement state management for the counter using the useState hook.",
                "Apply event handlers to increment and decrement the counter value based on user interaction.",
                "Update component state correctly in response to button click events.",
                "Use JSX to bind state values and event handlers within the rendered output.",
                "Run the component and verify that the counter updates correctly in the browser."
            ]
        elif 'list' in title.lower() or 'rendering' in title.lower():
            objectives = [
                "Create a React component that renders a list of items from an array.",
                "Implement list rendering using the map() method to transform array data.",
                "Apply the key prop correctly to each list item for React's reconciliation.",
                "Use JSX to render dynamic list content within the component output.",
                "Bind array data to component props and render the list in the browser.",
                "Verify that list items update correctly when the array data changes."
            ]
        elif 'form' in title.lower():
            objectives = [
                "Create a React form component with input fields and validation.",
                "Implement controlled inputs using useState to manage form state.",
                "Apply event handlers to capture and update form field values.",
                "Use JSX to bind form inputs to state values and handlers.",
                "Handle form submission and verify form data is captured correctly.",
                "Run the component and test form interactions in the browser."
            ]
        elif 'hook' in title.lower():
            objectives = [
                "Create a custom React hook that encapsulates reusable logic.",
                "Implement hook logic using React's built-in hooks.",
                "Apply the custom hook in a functional component.",
                "Use the hook to manage component state or side effects.",
                "Verify the hook behavior by testing it in a component.",
                "Run the component and confirm the hook works as expected."
            ]
        else:
            # Generic React component objectives
            objectives = [
                f"Create a React functional component that implements {title.lower()}.",
                f"Implement component logic using React hooks and JSX syntax.",
                "Apply event handlers and state management to make the component interactive.",
                "Use JSX to render the component output with proper structure.",
                "Bind component props and state to the rendered elements.",
                "Run the component and verify it displays and functions correctly in the browser."
            ]
    
    elif domain == 'nodejs':
        if 'api' in title.lower() or 'endpoint' in title.lower():
            objectives = [
                f"Create an Express API endpoint that handles {title.lower()} requests.",
                "Implement request handling logic using Express route handlers.",
                "Apply middleware to process requests and responses.",
                "Use Express routing to define the endpoint path and HTTP method.",
                "Test the endpoint using HTTP requests and verify the response.",
                "Run the server and confirm the endpoint works correctly."
            ]
        else:
            objectives = [
                f"Create a Node.js implementation for {title.lower()}.",
                "Implement the solution using Node.js core modules and Express.",
                "Apply Node.js patterns and conventions to structure the code.",
                "Use appropriate Node.js APIs to implement the functionality.",
                "Test the implementation and verify it works as expected.",
                "Run the code and confirm it executes without errors."
            ]
    
    elif domain == 'python':
        if 'api' in title.lower():
            objectives = [
                f"Create a Flask API endpoint that handles {title.lower()} requests.",
                "Implement route handling using Flask decorators and functions.",
                "Apply request parsing to extract data from HTTP requests.",
                "Use Flask response methods to return appropriate data.",
                "Test the endpoint and verify it returns correct responses.",
                "Run the Flask application and confirm the endpoint works."
            ]
        else:
            objectives = [
                f"Create a Python implementation for {title.lower()}.",
                "Implement the solution using Python standard library and Flask.",
                "Apply Python best practices to structure the code.",
                "Use appropriate Python functions and data structures.",
                "Test the implementation and verify the output.",
                "Run the Python code and confirm it executes successfully."
            ]
    
    else:
        # Generic fallback
        objectives = [
            f"Create a {technology} implementation for {title.lower()}.",
            f"Implement the solution using {technology} features and patterns.",
            f"Apply {technology} conventions to structure the code.",
            f"Use {technology} syntax and APIs to build the functionality.",
            "Test the implementation and verify it works correctly.",
            "Run the code and confirm it executes as expected."
        ]
    
    # Format as numbered list
    formatted = "By the end of this lesson, the learner will be able to:\n\n"
    for i, obj in enumerate(objectives[:6], 1):  # Limit to 6 objectives
        formatted += f"{i}. {obj}\n\n"
    
    return formatted.strip()

def update_challenge_objectives(file_path, domain):
    """Update learning objectives in a challenge JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            challenge_data = json.load(f)
        
        if 'flow' not in challenge_data:
            return False
        
        # Find the title step
        title_step_idx = None
        for idx, step in enumerate(challenge_data['flow']):
            if step.get('stepId') == 'title':
                title_step_idx = idx
                break
        
        if title_step_idx is None:
            return False
        
        # Generate new objectives
        title = challenge_data.get('title', '')
        technology = challenge_data.get('technology', '')
        tests = challenge_data.get('metadata', {}).get('tests', '')
        
        new_objectives = generate_objectives(title, technology, tests, domain)
        
        # Update the step
        if challenge_data['flow'][title_step_idx]['mentorSays'] != new_objectives:
            challenge_data['flow'][title_step_idx]['mentorSays'] = new_objectives
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(challenge_data, f, indent=2, ensure_ascii=False)
            return True
        
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to update all challenge files."""
    base_dir = Path(__file__).parent
    domains = ['react', 'nodejs', 'python', 'java', 'go', 'swift', 'angular', 'react-typescript']
    
    total_files = 0
    updated_files = 0
    
    for domain in domains:
        domain_path = base_dir / domain
        if not domain_path.exists():
            print(f"WARNING: Domain directory not found: {domain}")
            continue
        
        print(f"\nProcessing {domain}...")
        json_files = list(domain_path.glob('*.json'))
        
        for json_file in json_files:
            total_files += 1
            if update_challenge_objectives(json_file, domain):
                updated_files += 1
                print(f"  Updated: {json_file.name}")
    
    print(f"\nDone! Updated {updated_files} out of {total_files} files.")

if __name__ == '__main__':
    main()

