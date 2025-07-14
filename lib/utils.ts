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

export const configureAssistant = (voice: string, style: string) => {
  const voiceId = voices[voice as keyof typeof voices][
          style as keyof (typeof voices)[keyof typeof voices]
          ] || "sarah";

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
                          - Style: {{ style }} 
                          
                          Guidelines:
                          1. Stay focused on the given topic and subject at all times. Avoid going off-topic.
                          2. Break it down – teach the material in small, manageable parts. Introduce one concept at a time.
                          3. Check for understanding – regularly ask short questions to confirm the student is following.
                          4. Guide the flow – keep the conversation smooth and structured, but maintain control of the direction.
                          5. Use short, natural responses – just like in a real voice conversation.
                          6. Avoid special characters or formatting – this is a voice interaction only.
                          7. Maintain your tone and style as specified.
                          
                          Your goal is to make learning clear, interactive, and engaging — one step at a time.`,
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
