const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getLearningObjectives(task, tech) {
  try {
    const prompt = `Give me the lesson-end learning objectives that a programmer can learn by building "${task}" in ${tech}. 

List the technical skills and concepts a programmer will get comfortable with or master by completing this task. Focus on:
- Core concepts and patterns
- Technical skills specific to ${tech}
- Best practices they'll learn
- Problem-solving approaches

Format as a clear, concise list.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert programming educator who identifies key learning objectives from coding tasks."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    return {
      success: true,
      objectives: completion.choices[0].message.content
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = { getLearningObjectives };