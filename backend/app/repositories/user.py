from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> User | None:
        query = select(User).where(User.email == email)
        return self.db.execute(query).scalar_one_or_none()

    def get_by_id(self, user_id: int) -> User | None:
        query = select(User).where(User.id == user_id)
        return self.db.execute(query).scalar_one_or_none()

    def create(self, first_name: str, last_name: str, email: str, password_hash: str) -> User:
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password_hash=password_hash,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_names(self, user: User, first_name: str, last_name: str) -> User:
        user.first_name = first_name
        user.last_name = last_name
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
