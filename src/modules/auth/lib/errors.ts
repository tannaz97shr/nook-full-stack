export class EmailAlreadyRegisteredError extends Error {
  constructor(email: string) {
    super(`Email already registered: ${email}`);
    this.name = "EmailAlreadyRegisteredError";
  }
}

export class ProviderCollisionError extends Error {
  constructor(email: string, existingProvider: string) {
    super(`Email ${email} is already registered via ${existingProvider}`);
    this.name = "ProviderCollisionError";
  }
}
