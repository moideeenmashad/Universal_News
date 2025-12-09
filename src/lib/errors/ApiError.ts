export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Creates an ApiError from a fetch error
   */
  static fromFetchError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }
    
    if (error instanceof Error) {
      return new ApiError(error.message, 500);
    }
    
    return new ApiError('An unknown error occurred', 500);
  }

  /**
   * Legacy method for axios errors (kept for compatibility)
   */
  static fromAxiosError(error: unknown): ApiError {
    return this.fromFetchError(error);
  }
}
