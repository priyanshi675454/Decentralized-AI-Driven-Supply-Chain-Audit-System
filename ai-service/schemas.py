from pydantic import BaseModel
from typing import Optional

class ShipmentInput(BaseModel):
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    shippingTime: Optional[float] = None
    category: Optional[str] = "other"

class AnalysisResult(BaseModel):
    riskScore: float
    isAnomaly: bool
    reasons: list
    method: str