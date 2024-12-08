from fastapi import APIRouter, UploadFile, File, HTTPException
import httpx
from app.config import settings

router = APIRouter()


@router.post("/", response_model=dict)
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read file content
        file_content = await file.read()

        # Prepare the file for Pinata upload
        files = {"file": (file.filename, file_content, file.content_type)}

        headers = {"Authorization": f"Bearer {settings.PINATA_JWT}"}

        # Upload to Pinata
        async with httpx.AsyncClient() as client:
            response = await client.post(settings.PINATA_UPLOAD_URL, files=files, headers=headers)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to upload to IPFS")

        response_json = response.json()
        ipfs_hash = response_json["IpfsHash"]

        # Construct the IPFS gateway URL
        ipfs_url = f"{settings.PINATA_GATEWAY}/{ipfs_hash}"

        return {"url": ipfs_url, "hash": ipfs_hash}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
