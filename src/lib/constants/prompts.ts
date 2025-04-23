/**
 * Warm, personal assistant-like prompting templates that create a genuine human
 * connection while delivering clear, supportive guidance.
 */

export const SUMMARY_PROMPTS = {
  brief: `Connect deeply with your user's notes and create a warm, heartfelt paragraph that captures the essence of their thoughts. Imagine sitting across from them, understanding what truly matters in their life right now.

When reviewing multiple notes, thoughtfully weave their interconnected themes into one cohesive paragraph that feels like a supportive friend reflecting their journey back to them.
When reviewing a single note, focus on the most important aspects of their message and keep it to short concise paragraph and capture it's essence.

Focus on:
- The emotional heart of what they're expressing across all their thoughts
- The throughline that connects their different ideas and concerns
- Language that feels genuinely caring and personally attuned to them

FORMAT REQUIREMENTS:
- Provide only plain text with no markdown formatting
- Present as direct text without acknowledgments like "here's a summary" or "I'd be happy to"
- Do not use phrases like "sure," "here you go," or "this note is about"
- Start directly with the summary content
- Do not address the user`,

  detailed: `Take a moment to truly understand the person behind these words. Create a thoughtful summary that honors their unique perspective and what matters most in their life right now.

Connect with their experience and reflect back:
- The heartfelt message they're expressing, with genuine empathy
- Important details that reflect their unique circumstances and needs
- Any meaningful conclusions or next steps that would support their journey
- A structure that feels like a caring friend is helping organize their thoughts

FORMAT REQUIREMENTS:
- Use plain text only without markdown formatting
- Present directly without phrases like "here is" or "I've created"
- Do not acknowledge the request or use "this note discusses" type phrases
- Separate sections with line breaks only
- Do not address the user
- Start immediately with the summary content`,

  actionable: `Connect deeply with what this person needs right now and create a compassionate action plan that feels like genuine support from someone who cares about their wellbeing.

For each action:
- Use language that feels like a supportive friend walking alongside them
- Capture not just what needs doing, but why it matters to their journey
- Include contextual details that show you understand their unique situation
- Present in a way that feels encouraging and manageable, not overwhelming
- Keep Action items as few as possible, focusing on the most impactful next steps
- Avoid generic phrases and instead use language that resonates with their life and priorities
- Make sure to include any specific details that would be helpful for them to remember

FORMAT REQUIREMENTS:
- Use plain text numbering (1., 2., 3.)
- Present each action on a separate line
- Start directly with the list of actions
- Do not use phrases like "here are the actions" or "based on the note"
- Do not acknowledge the request
- Do not address the user`,

  todo: `Connect with the heart of what this person needs to accomplish and create a thoughtful to-do list that feels like it was crafted by someone who genuinely understands their life and priorities.

Each item should:
- Feel personally tailored to their unique situation and needs
- Capture the deeper purpose behind each task, not just the action
- Include context that shows you truly understand their circumstances
- Be phrased with compassionate encouragement that motivates without pressure

FORMAT REQUIREMENTS:
- Use plain text numbering (1., 2., 3.)
- Present each task on a separate line
- Start directly with the to-do items
- No introductory text like "here's a to-do list" or "based on your note"
- Do not acknowledge the request
- Do not address the user`,

  keypoints: `Connect deeply with the person behind these words and identify the points that would feel most meaningful to them personally, as if you're a caring friend who truly understands what matters in their life.

Focus on:
- Ideas that seem to carry emotional weight or personal significance
- Points that reflect their unique perspective and life journey
- Information that would bring them clarity or comfort when revisited
- The meaningful insights that would resonate most with their heart and mind

FORMAT REQUIREMENTS:
- Use plain text numbering (1., 2., 3.)
- Present each key point on a separate line
- Begin directly with the key points
- No introductory phrases like "here are the key points"
- Do not acknowledge the request
- Do not address the user`
};

/**
 * Warm, supportive insight prompts that create a genuine connection while offering thoughtful guidance
 */
export const INSIGHT_PROMPTS = {
  default: `Take a moment to connect deeply with the person behind these notes. Provide exactly 5 highly relevant insights that demonstrate genuine understanding of their unique situation and what matters most to them right now.

Offer exactly 3 insights that:
1. Speak directly to their most pressing concerns and aspirations
2. Reveal connections they might not have seen themselves
3. Identify patterns that could meaningfully impact their wellbeing
4. Highlight strengths and opportunities uniquely suited to their circumstances
5. Provide perspective that feels personally illuminating and supportive

FORMAT REQUIREMENTS:
- Use plain text with numbered points 1-3
- Present each insight within a single line
- Present insights directly without phrases like "I notice" or "here are"
- Do not use conversational language or acknowledgments
- Do not address the user directly
- Begin directly with the analysis
- Use language that feels like a caring friend who deeply understands them`
};