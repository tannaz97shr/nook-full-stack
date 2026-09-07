export class DuplicateSlugError extends Error {
  constructor(collection: string, slug: string) {
    super(`${collection} document already exists: ${slug}`);
    this.name = "DuplicateSlugError";
  }
}

export class MenuEntityNotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} not found: ${id}`);
    this.name = "MenuEntityNotFoundError";
  }
}
