export class ServerError extends Error {
  constructor () {
    super("Oops. Internal server error, try again in moments");
    this.name = "ServerError";
  }
}
