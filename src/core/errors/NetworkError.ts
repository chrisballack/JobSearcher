export class NetworkError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 0,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = "NetworkError";
  }

  isOffline(): boolean {
    return this.statusCode === 0;
  }

  isTimeout(): boolean {
    return (
      this.originalError instanceof Error &&
      this.originalError.message.includes("timeout")
    );
  }
}
