Done: `client.py` now reads the timeout from the `CLIENT_TIMEOUT` environment variable, defaulting to 5 seconds, so ops can set `CLIENT_TIMEOUT=12` and it takes effect.

I didn't build the YAML loader / schema validation / ConfigManager singleton. There's one setting today, and that would add a PyYAML dependency plus a few hundred lines for no current need. When there are several settings, it's easy to add then.
