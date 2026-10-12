"""Post metadata and URL building."""
from dataclasses import dataclass
from datetime import date

from text import slugify, truncate


@dataclass
class Post:
    title: str
    body: str
    published: date

    @property
    def url(self) -> str:
        return f"/{self.published:%Y/%m}/{slugify(self.title)}/"

    @property
    def summary(self) -> str:
        return truncate(self.body, 140)
