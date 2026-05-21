import { getPrisma, isDatabaseConfigured } from '@/lib/db';
import type { TutorAnswer } from '@/features/ai/types';
import {
  AccessDeniedError,
  getUserIdByClerkId,
} from '@/features/ai/services/accessService';
import { retrieveChunksForCourse } from '@/features/ai/services/retrievalService';

export class TutorError extends Error {
  constructor(
    message: string,
    readonly code: 'NOT_CONFIGURED' | 'USER_NOT_FOUND' | 'ACCESS_DENIED' | 'NO_CONTEXT',
  ) {
    super(message);
    this.name = 'TutorError';
  }
}

async function generateAnswerWithLlm(
  question: string,
  contextBlocks: string[],
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const context = contextBlocks.join('\n\n---\n\n');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'Você é o tutor técnico do Estúdio AEC (BIM/Revit). Responda em português usando apenas o contexto fornecido. Se o contexto não cobrir a pergunta, diga que não há material no curso sobre o assunto.',
        },
        {
          role: 'user',
          content: `Contexto do curso:\n${context}\n\nPergunta do aluno: ${question}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  return json.choices?.[0]?.message?.content?.trim() ?? null;
}

function buildFallbackAnswer(question: string, contextBlocks: string[]): string {
  if (contextBlocks.length === 0) {
    return 'Não há material indexado neste curso para responder à sua pergunta ainda.';
  }

  const excerpt = contextBlocks[0].slice(0, 480);
  return `Com base no material do curso sobre "${question.slice(0, 80)}": ${excerpt}${excerpt.length >= 480 ? '…' : ''}`;
}

export async function answerCourseQuestion(input: {
  clerkUserId: string;
  courseId: string;
  message: string;
}): Promise<TutorAnswer> {
  if (!isDatabaseConfigured()) {
    throw new TutorError('Database not configured', 'NOT_CONFIGURED');
  }

  const userId = await getUserIdByClerkId(input.clerkUserId);
  if (!userId) {
    throw new TutorError('User not found', 'USER_NOT_FOUND');
  }

  const message = input.message.trim();
  if (!message) {
    throw new TutorError('Message is required', 'NO_CONTEXT');
  }

  let sources;
  try {
    sources = await retrieveChunksForCourse({
      userId,
      courseId: input.courseId,
      query: message,
      limit: 5,
    });
  } catch (error) {
    if (error instanceof AccessDeniedError) {
      throw new TutorError(error.message, 'ACCESS_DENIED');
    }
    throw error;
  }

  const contextBlocks = sources.map((s) => s.content);
  const llmAnswer = await generateAnswerWithLlm(message, contextBlocks);
  const usedLlm = Boolean(llmAnswer);
  const answer = llmAnswer ?? buildFallbackAnswer(message, contextBlocks);

  const prisma = getPrisma();
  const conversation = await prisma.aiConversation.create({
    data: {
      userId,
      courseId: input.courseId,
      title: message.slice(0, 80),
    },
  });

  await prisma.aiMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'user',
      content: message,
    },
  });

  const assistantMessage = await prisma.aiMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'assistant',
      content: answer,
    },
  });

  for (const source of sources) {
    await prisma.aiRetrievalLog.create({
      data: {
        messageId: assistantMessage.id,
        chunkId: source.id,
        score: source.score,
      },
    });
  }

  return { answer, sources, usedLlm };
}
