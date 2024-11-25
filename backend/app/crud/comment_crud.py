from sqlalchemy.orm import Session
from app.models import TokenComment
from app.schemas import CommentCreate

def create_comment(db: Session, comment: CommentCreate):
    db_comment = TokenComment(**comment.dict())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_comments_by_token(db: Session, token_id: int):
    return db.query(TokenComment).filter(TokenComment.token_id == token_id).all()
