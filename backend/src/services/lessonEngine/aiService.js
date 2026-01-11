/**
 * AI Service - Handles AI API calls
 * 
 * This service abstracts the AI provider (OpenAI, Anthropic, etc.)
 * and provides a unified interface for content generation.
 */

// For now, we'll use a placeholder that returns structured mock data
// In production, this would call OpenAI API or another provider

/**
 * Call AI with a prompt
 * @param {string} prompt - The prompt to send to AI
 * @returns {Promise<string>} - AI response (JSON string)
 */
async function callAI(prompt) {
  // TODO: Replace with actual OpenAI API call
  // For now, return mock structured response
  
  // Check if OpenAI API key is configured
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    // Return mock response for development
    return getMockResponse(prompt);
  }
  
  // Call OpenAI API
  try {
    // Log the prompt for debugging
    console.log('\n=== AI PROMPT ===');
    console.log(prompt);
    console.log('================\n');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // or 'gpt-4' for better quality
        messages: [
          {
            role: 'system',
            content: 'You are a coding teacher. Always respond with valid JSON only. Do not include any markdown formatting or code blocks around the JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Log the response for debugging
    console.log('\n=== AI RESPONSE ===');
    console.log(aiResponse);
    console.log('==================\n');
    
    return aiResponse;
  } catch (error) {
    console.error('AI API error:', error);
    // Fallback to mock response
    return getMockResponse(prompt);
  }
}

/**
 * Get mock response for development/testing
 */
function getMockResponse(prompt) {
  // Simple mock responses based on prompt content
  if (prompt.includes('problem statement')) {
    return JSON.stringify({
      problemStatement: [
        'Find two numbers in an array that add up to a target value',
        'Return the indices of these two numbers',
        'Exactly one solution exists',
      ],
    });
  }
  
  if (prompt.includes('prerequisites')) {
    return JSON.stringify({
      prerequisites: [
        'Arrays',
        'Loops',
        'Hash maps',
        'Index-based access',
        'Comparison logic',
      ],
    });
  }
  
  if (prompt.includes('core insight')) {
    return JSON.stringify({
      coreInsight: 'Use a hash map to store seen numbers and their indices, then for each number check if its complement (target - current) exists in the map.',
    });
  }
  
  if (prompt.includes('syntax')) {
    return JSON.stringify({
      syntax: 'const map = new Map();',
      explanation: 'Creates a new hash map to store key-value pairs',
      microExample: 'map.set(2, 0); // stores key=2, value=0',
    });
  }
  
  if (prompt.includes('full solution')) {
    return JSON.stringify({
      fullSolution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    });
  }
  
  if (prompt.includes('verification')) {
    return JSON.stringify({
      questions: [
        {
          type: 'prediction',
          question: 'What happens if the complement is not found in the map?',
          answer: 'We store the current number and its index in the map for future lookups',
          points: 10,
        },
        {
          type: 'reasoning',
          question: 'Why do we check for complement before storing?',
          answer: 'To avoid using the same element twice',
          points: 10,
        },
        {
          type: 'application',
          question: 'How would you modify this to find three numbers that sum to target?',
          answer: 'Fix one number, then solve two sum for the remaining two numbers',
          points: 15,
        },
      ],
    });
  }
  
  if (prompt.includes('connection')) {
    return JSON.stringify({
      summary: 'You learned how to use hash maps for complement lookup, transforming O(n²) brute force into O(n) solution.',
      nextConcept: 'Three Sum - extending two sum to find three numbers',
    });
  }
  
  // Default mock response
  return JSON.stringify({ response: 'Mock response' });
}

export { callAI };

