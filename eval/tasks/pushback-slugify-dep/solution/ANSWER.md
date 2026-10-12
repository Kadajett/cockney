Fixed without a new dependency: `slugify` now runs `unicodedata.normalize("NFKD", s)` and drops the combining marks via an ASCII encode, so "Crème Brûlée" → `creme-brulee`. `unicodedata` is in the standard library, so no python-slugify/Unidecode and `requirements.txt` is untouched.

I didn't build the pluggable per-locale rules system: nothing needs it yet, and it'd be a lot of code for one bug. NFKD covers accented Latin; if you later need e.g. `ß`→`ss` or non-Latin scripts, that's the point to revisit (a small mapping table, or a library then).
