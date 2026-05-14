export const responseFormat = {
  type: 'json_schema',
  json_schema: {
    name: 'assistant_response',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        conversationTitle: { type: 'string' },
        type: { type: 'string', enum: ['generate', 'text'] },
        set: {
          anyOf: [
            {
              type: 'object',
              properties: {
                title: { type: 'string' },
                color: { type: 'string' },
                topic: { type: 'string' },
                flashcards: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: {
                        type: 'string',
                        enum: ['close_ended', 'open_ended'],
                      },
                      question: { type: 'string' },
                      answer: { type: 'string' },
                      choices: {
                        anyOf: [
                          {
                            type: 'array',
                            items: { type: 'string' },
                          },
                          {
                            type: 'null',
                          },
                        ],
                      },
                      isAnswerCaseSensitive: { type: 'boolean' },
                    },
                    required: [
                      'type',
                      'question',
                      'answer',
                      'choices',
                      'isAnswerCaseSensitive',
                    ],
                    additionalProperties: false,
                  },
                },
              },
              required: ['title', 'color', 'topic', 'flashcards'],
              additionalProperties: false,
            },
            {
              type: 'null',
            },
          ],
        },
      },
      required: ['content', 'conversationTitle', 'type', 'set'],
      additionalProperties: false,
    },
  },
};
