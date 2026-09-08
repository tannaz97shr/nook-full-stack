export class DuplicateSlugError extends Error {
  constructor(collection: string, slug: string) {
    super(`${collection} document already exists: ${slug}`);
    this.name = "DuplicateSlugError";
  }
}

export class RewardNotFoundError extends Error {
  constructor(id: string) {
    super(`Reward not found: ${id}`);
    this.name = "RewardNotFoundError";
  }
}
