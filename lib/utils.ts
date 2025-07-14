import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectsColors, voices } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
};

export const configureAssistant = (voice: string, style: string, teachingStyle?: string) => {
  console.log('configureAssistant called with:', { voice, style, teachingStyle });
  
  // Handle cases where voice might be in format "male_casual" or "female_formal"
  let voiceGender = voice;
  let voiceStyle = style;
  
  if (voice && voice.includes('_')) {
    const [gender, styleFromVoice] = voice.split('_');
    voiceGender = gender;
    voiceStyle = styleFromVoice;
  }
  
  // Ensure we have valid values with fallbacks
  const validVoice = (voiceGender === 'male' || voiceGender === 'female') ? voiceGender : 'female';
  const validStyle = (voiceStyle === 'casual' || voiceStyle === 'formal') ? voiceStyle : 'casual';
  
  console.log('Using voice config:', { validVoice, validStyle });
  
  // Extra safety check
  let voiceId = "sarah"; // Default fallback
  try {
    if (voices[validVoice] && voices[validVoice][validStyle]) {
      voiceId = voices[validVoice][validStyle];
    }
  } catch (error) {
    console.error('Error accessing voice config:', error, { validVoice, validStyle });
  }
  
  console.log('Final voiceId:', voiceId);

  const vapiAssistant: CreateAssistantDTO = {
    name: "Companion",
    firstMessage: "Hi there! Let’s begin our session. Today, we're diving into {{topic}}.",
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable and engaging tutor conducting a real-time voice conversation with a student. Your objective is to teach the student about a specific topic and subject.

                          Session Details:
                          - Topic: {{ topic }}
                          - Subject: {{ subject }}
                          - Communication Style: {{ style }}
                          - Teaching Style: {{ teachingStyle }}
                          
                          Teaching Style Guidelines:
                          ${teachingStyle === 'quick' ? 
                            '- QUICK & FOCUSED: Keep explanations brief and to the point. Use rapid-fire Q&A format. Focus only on essential concepts. Be concise and efficient.' :
                            teachingStyle === 'balanced' ?
                            '- BALANCED & INTERACTIVE: Mix explanations with practice exercises. Check understanding regularly. Balance theory with practical examples. Maintain good pacing.' :
                            '- DEEP & COMPREHENSIVE: Provide detailed explanations with context. Use analogies and multiple examples. Explore concepts thoroughly. Take time to ensure deep understanding.'
                          }
                          
                          General Guidelines:
                          1. Stay focused on the given topic and subject at all times. Avoid going off-topic.
                          2. Adapt your teaching approach based on the specified teaching style above.
                          3. Check for understanding – regularly ask short questions to confirm the student is following.
                          4. Guide the flow – keep the conversation smooth and structured, but maintain control of the direction.
                          5. Use short, natural responses – just like in a real voice conversation.
                          6. Avoid special characters or formatting – this is a voice interaction only.
                          7. Maintain your communication style (formal/casual) as specified.
                          
                          Your goal is to make learning clear, interactive, and engaging using the specified teaching approach.`,
        },
      ],
    },
    // @ts-ignore
    clientMessages: [],
    // @ts-ignore
    serverMessages: [],
  };
  return vapiAssistant;
};
