export class ServerError extends Error {
  constructor (stack: string) {
    super("Oops. Internal server error, try again in moments");
    this.name = "ServerError";
    this.stack = stack;
  }
}
