from fastapi import FastAPI
from app.routes import token_routes, transaction_routes, comment_routes, upload_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Token Management API", version="1.0.0")

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(token_routes.router, prefix="/tokens", tags=["Tokens"])
app.include_router(transaction_routes.router, prefix="/transactions", tags=["Transactions"])
app.include_router(comment_routes.router, prefix="/comments", tags=["Comments"])
app.include_router(upload_routes.router, prefix="/upload", tags=["File Upload"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the Token Management API"}
