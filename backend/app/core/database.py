from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

# PostgreSQL connection pool — tuned for production use
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=10,       # base persistent connections
    max_overflow=20,    # extra connections allowed under load
    pool_pre_ping=True, # verify connection is alive before use
    pool_recycle=1800,  # recycle connections every 30 min
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
