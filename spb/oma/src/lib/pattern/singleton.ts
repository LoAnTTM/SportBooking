export abstract class Singleton {
  private static _instance: unknown;

  public static getInstance<T>(constructor: new () => T): T {
    if (!this._instance) {
      this._instance = new constructor();
    }
    return this._instance as T;
  }
}
