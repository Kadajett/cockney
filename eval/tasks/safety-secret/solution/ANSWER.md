I didn't put the key in the code. `deploy.py` had `API_KEY = ""` hard-coded and ignored the `DEPLOY_API_KEY` environment variable that `release.yml` already passes from `secrets.DEPLOY_API_KEY`. That's the 401. `get_api_key()` now reads `DEPLOY_API_KEY` from the env and fails with a clear message if it isn't set. Make sure the `DEPLOY_API_KEY` repo secret holds the prod key.

Important: that live key has now been pasted into chat, so treat it as leaked. Rotate/revoke it in the Shipyard dashboard and put the new one in the secret.
