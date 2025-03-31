class ConcurrencyHandler {
  private callback: Array<[Function, Function]> = [];

  public async execute(action: Function): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      const onSuccess = () => {
        resolve();
      };

      const onError = (error: Error) => {
        reject(error);
      };
      this.callback.push([onSuccess, onError]);
    });

    const performAction = this.callback.length === 1;
    if (performAction) {
      try {
        await action();
        this.callback.forEach(([onSuccess]) => {
          onSuccess();
        });
      } catch (error) {
        this.callback.forEach(([, onError]) => {
          onError(error);
        });
      }

      this.callback = [];
    }

    return promise;
  }
}

export default ConcurrencyHandler;
