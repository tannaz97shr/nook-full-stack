export const ERROR_CONTENT = {
  boundary: {
    title: "Something went wrong in the back room",
    description:
      "That page hit a snag. It's usually a passing thing — try again in a moment.",
    actionLabel: "Try again",
  },
  notFound: {
    eyebrow: "404",
    title: "This table's empty",
    description:
      "We looked behind the counter and under the pastry case, but there's no page here. The link may be old, or the address has a typo.",
    primaryAction: "Back to the menu",
    secondaryAction: "Go home",
  },
  global: {
    title: "We knocked something over",
    description:
      "The whole page needs a moment to reset. Reloading should sort it out.",
    actionLabel: "Reload",
  },
} as const;
