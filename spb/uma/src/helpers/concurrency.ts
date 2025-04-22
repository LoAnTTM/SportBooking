class ConcurrencyHandler {
  private static instance: ConcurrencyHandler;
  private isExecuting: boolean = false;
  private callback: Array<[Function, Function]> = [];
  private lastError: Error | null = null;

  private constructor() {}

  public static getInstance(): ConcurrencyHandler {
    if (!ConcurrencyHandler.instance) {
      ConcurrencyHandler.instance = new ConcurrencyHandler();
    }
    return ConcurrencyHandler.instance;
  }

  public async execute(action: Function): Promise<void> {
    // If there was a previous error, reject immediately
    if (this.lastError) {
      return Promise.reject(this.lastError);
    }

    const promise = new Promise<void>((resolve, reject) => {
      const onSuccess = () => {
        resolve();
      };

      const onError = (error: Error) => {
        reject(error);
      };
      this.callback.push([onSuccess, onError]);
    });

    if (!this.isExecuting) {
      this.isExecuting = true;
      try {
        await action();
        this.callback.forEach(([onSuccess]) => {
          onSuccess();
        });
      } catch (error) {
        this.lastError = error as Error;
        this.callback.forEach(([_, onError]) => {
          onError(error);
        });
      } finally {
        this.isExecuting = false;
        this.callback = [];
      }
    }

    return promise;
  }

  public reset(): void {
    this.lastError = null;
    this.isExecuting = false;
    this.callback = [];
  }
}

export default ConcurrencyHandler;
