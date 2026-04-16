export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
  }
}

export function handleApiError(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json({ error: error.message, code: error.code }, { status: error.status });
  }

  // Log unexpected errors (in production this would go to Sentry/Datadog)
  console.error('[API Error]', error);

  return Response.json(
    { error: 'An unexpected error occurred. Please try again.' },
    { status: 500 }
  );
}
