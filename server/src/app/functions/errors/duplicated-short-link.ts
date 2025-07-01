export class DuplicatedShortLinkError extends Error {
  constructor() {
    super('Duplicated short link');
  }
}
