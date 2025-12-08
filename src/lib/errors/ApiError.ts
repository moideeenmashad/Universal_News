export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromAxiosError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      const statusCode = axiosError.response?.status;
      const message =
        statusCode === 401
          ? 'API key is invalid or expired'
          : statusCode === 429
          ? 'Too many requests. Please try again later'
          : statusCode === 500
          ? 'Server error. Please try again later'
          : 'Failed to fetch news. Please check your connection';

      return new ApiError(message, statusCode, error);
    }

    if (error instanceof Error) {
      return new ApiError(error.message, undefined, error);
    }

    return new ApiError('An unexpected error occurred', undefined, error);
  }
}

