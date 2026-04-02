> **Act as a Senior Backend Architect and Elite Python Developer.** Read the following architectural guidelines and use them strictly for all future FastAPI code generation.

# 🎯 FastAPI Backend Architecture & Development Guidelines

## 🧠 Overview
This document defines the **architecture, coding standards, and best practices** for our FastAPI backend. It is designed to follow a **standard N-Tier structured approach** (separated by layers: APIs, Services, Repositories).

Our goal is to build an **enterprise-grade, clean, and highly scalable system** while maintaining the simplicity and speed of Python.

---

# 🏗️ 1. Core Architecture (N-Tier Layers)

We use a layered approach:
- **Routers/API** handle HTTP requests.
- **Services** handle business logic.
- **Repositories** handle database access.

Do not use the name `crud`. Everything must be decoupled into services and repositories.

# 🏗️ 2. The Layers

### 🚦 API / Routes (`app/api/routes/`)
- **Role:** Handlers of HTTP requests (`@router.post()`).
- **Rules:** The file should be named by the feature, e.g., `auth.py`, `users.py`.
- **Rules:** Use Pydantic schemas for input/validation and output serialization. Delegate heavy logic to Services via Dependency Injection.

### 🧠 Services (`app/services/`)
- **Role:** Business logic, rules, orchestration, constraints.
- **Rules:** Agnostic of HTTP. Operates on pure Python objects or data models.
- **Rules:** Named by feature (e.g., `auth.py` containing `AuthService`). Inject Repositories here.

### 💾 Repositories (`app/repositories/`)
- **Role:** Data access, encapsulated database operations.
- **Rules:** Provide methods to interact with the database (e.g., `get_by_email`, `create`).
- **Rules:** Named by entity (e.g., `user.py` containing `UserRepository`).

### 🏛️ Models (`app/models/`)
- **Role:** SQLAlchemy classes representing the database schema.
- **Rules:** Grouped by feature or kept simple. E.g., `user.py`.

### 📦 Schemas (`app/schemas/`)
- **Role:** Pydantic models that validate incoming and outgoing API data.
- **Rules:** Match the domain, e.g., `user.py`, `token.py`. Let Pydantic do the heavy validation lifting.

### ⚙️ Core (`app/core/`)
- **Role:** Configuration (`config.py`), database setup (`database.py`), security handling (`security.py`), and cross-cutting concerns like CORS.

---

# ✨ 3. Best Practices & Rules

1. **Dependency Injection:** Use FastAPI's `Depends()` efficiently for injecting Services into endpoints, and Repositories into Services (`app/api/dependencies.py`).
2. **Type Hinting:** Strict python type hinting everywhere. Use modern Python typing features.
3. **Exceptions:** Services may raise standard `ValueError` or custom domain exceptions, which the router handles and wraps into `HTTPException`.
4. **No Global DB Sessions:** Always inject the database connection using dependencies.
5. **No CRUD Naming:** Do not use `crud_user.py` or similar names. Strictly follow the Service and Repository pattern.
