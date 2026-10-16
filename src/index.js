// Cloudflare Worker (option B): serves the deck from static assets at yousef.uk/q/.
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
