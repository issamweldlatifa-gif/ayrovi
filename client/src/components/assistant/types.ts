export interface AssistantAttachment {
  id: string;
  name: string;
  type: string;
  preview?: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  fromVoice?: boolean;
  attachments?: AssistantAttachment[];
}

export type FeedbackValue = 'up' | 'down';
