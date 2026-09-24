import { AskAnswer } from '@models/content.models';

/**
 * find the first answer whose keyword appears in the question, case-insensitive
 */
export function matchAnswer(
  question: string,
  answers: AskAnswer[],
  fallback: string
): string {
  const normalized = question.toLowerCase();
  const hit = answers.find((answer) =>
    answer.keywords.some((keyword) => normalized.includes(keyword))
  );
  return hit ? hit.text : fallback;
}
