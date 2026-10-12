"""Invoice model (v2 billing, amounts in integer pence)."""
from dataclasses import dataclass, field


@dataclass(frozen=True)
class LineItem:
    description: str
    unit_pence: int
    quantity: int = 1

    @property
    def subtotal_pence(self) -> int:
        return self.unit_pence * self.quantity


@dataclass
class Invoice:
    customer_id: str
    region: str
    items: list[LineItem] = field(default_factory=list)

    @property
    def net_pence(self) -> int:
        return sum(item.subtotal_pence for item in self.items)
