// Some dependencies (@actions/*, @octokit/*) are ESM-only and expose only the
// "import" export condition. Jest resolves with CommonJS conditions, so retry
// with the "import" condition when the default resolution fails.
module.exports = (request, options) => {
  try {
    return options.defaultResolver(request, options)
  } catch (error) {
    return options.defaultResolver(request, {
      ...options,
      conditions: [...(options.conditions ?? []), 'import']
    })
  }
}
