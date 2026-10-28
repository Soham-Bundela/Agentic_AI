# main.py
import base64
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List

app = FastAPI(title="Construction Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# Strict JSON Data Contracts
# ==========================================

class BoundingBox(BaseModel):
    x_min: float = Field(..., description="Normalized X min (0.0 to 1.0)")
    y_min: float = Field(..., description="Normalized Y min (0.0 to 1.0)")
    x_max: float = Field(..., description="Normalized X max (0.0 to 1.0)")
    y_max: float = Field(..., description="Normalized Y max (0.0 to 1.0)")

class Defect(BaseModel):
    defect_type: str = Field(..., description="Type of defect, e.g., 'concrete_spalling', 'hairline_crack'")
    severity: str = Field(..., description="Severity level: 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'")
    box: BoundingBox

class PPECompliance(BaseModel):
    hard_hats_detected: int = Field(..., description="Number of workers wearing hard hats")
    hi_vis_vests_detected: int = Field(..., description="Number of workers wearing high-visibility vests")
    violations_found: bool = Field(..., description="True if any worker is missing required PPE")

class SiteAnalysisResponse(BaseModel):
    compliance_summary: PPECompliance
    structural_defects: List[Defect]
    weather_advisory_flag: bool = Field(..., description="True if weather conditions pause site activity")
    recommended_action: str = Field(..., description="Actionable AI recommendation for the site manager")

# ==========================================
# Multimodal LLM Integration (Simulated)
# ==========================================

async def analyze_multimodal_payload(image_bytes: bytes) -> SiteAnalysisResponse:
    """
    In production, this passes the image and Pydantic schema to the LLM.
    e.g., gemini_client.generate_content([image, "Analyze safety.", schema=SiteAnalysisResponse])
    """
    # Simulated deterministic AI response for demonstration
    return SiteAnalysisResponse(
        compliance_summary=PPECompliance(
            hard_hats_detected=4,
            hi_vis_vests_detected=3,
            violations_found=True
        ),
        structural_defects=[
            Defect(
                defect_type="shear_crack",
                severity="CRITICAL",
                box=BoundingBox(x_min=0.45, y_min=0.30, x_max=0.55, y_max=0.80)
            )
        ],
        weather_advisory_flag=False,
        recommended_action="Halt pour on column B; structural crack detected. Issue PPE warning to zone 2."
    )

# ==========================================
# API Endpoints
# ==========================================

@app.post("/api/analyze-site", response_model=SiteAnalysisResponse)
async def analyze_site(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted.")
    
    contents = await file.read()
    
    # Process through Multimodal AI 
    ai_structured_output = await analyze_multimodal_payload(contents)
    
    return ai_structured_output


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)