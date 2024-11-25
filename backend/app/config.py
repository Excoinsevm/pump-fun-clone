from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    SECRET_KEY: str = "your_secret_key"

    PINATA_JWT: str = (
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJhMTQ5NDUzNi02MTllLTQxMDctODBjMS1jOTk5NWQ2ODU3MDciLCJlbWFpbCI6InF3aDAwNTAwN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYTc3M2Q0NGVmMGNhNWFkOWRkYmIiLCJzY29wZWRLZXlTZWNyZXQiOiJmNTNlNjg5OGUwMWQ5YzIyMWU2NTRmZDk3NGU5NjcxODg1YjUxNDkyOWQwNjU1MDY2MDJmNmY2NjNmZjhiZTM4IiwiZXhwIjoxNzY0MDgzODI0fQ.-Ia50eXj8FSiwtSjfhia4CxSxS4h06a7NPKBYDfLixc"
    )

    class Config:
        env_file = ".env"


settings = Settings()
