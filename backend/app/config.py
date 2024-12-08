from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/pump"
    SECRET_KEY: str = "OiJIUzI1NiIsInR5cCI6IkpXVCJ9"

    PINATA_JWT: str = (
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhMTQ5NDUzNi02MTllLTQxMDctODBjMS1jOTk5NWQ2ODU3MDciLCJlbWFpbCI6InF3aDAwNTAwN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYTc3M2Q0NGVmMGNhNWFkOWRkYmIiLCJzY29wZWRLZXlTZWNyZXQiOiJmNTNlNjg5OGUwMWQ5YzIyMWU2NTRmZDk3NGU5NjcxODg1YjUxNDkyOWQwNjU1MDY2MDJmNmY2NjNmZjhiZTM4IiwiZXhwIjoxNzY0MDgzODI0fQ.-Ia50eXj8FSiwtSjfhia4CxSxS4h06a7NPKBYDfLixc"
    )
    PINATA_UPLOAD_URL: str = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    PINATA_GATEWAY: str = "https://green-enormous-armadillo-214.mypinata.cloud/ipfs"

    FACTORY_CONTRACT: str = "0x670dd4081457891775d67472df76a8e6bec1356a"

    class Config:
        env_file = ".env"


settings = Settings()
