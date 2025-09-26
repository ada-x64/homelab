// The default export function runs exactly once on
// the server and once on the client during the
// first render, that is, it's not executed again
// in subsquent client-side navigation via React Router.
export default (ctx) => {};

export interface State {
  // from betterAuth
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null | undefined;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

// State initializer, must be a function called state
// as this is a special context.js export and has
// special processing, e.g., serialization and hydration
export function state(): State {
  return {
    user: null,
  };
}
