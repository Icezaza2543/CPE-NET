# 🌐 Computer Network Project

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

A Node.js and Express.js server built for a Computer Network laboratory project. It serves a student management dashboard and a RESTful Student API, plus a few legacy lab endpoints for observing HTTP status codes.

> Data is stored **in memory** and seeded with three sample students. Every restart resets the data.

---

## 👤 About Me
**Terasit Juntarasombut**  
🎓 *Bachelor's Degree in Computer Engineering*

### 🎯 Career Interests
* Embedded Engineer
* IoT Engineer
* IoT Developer
* IoT Product and Solution Expert

### 💻 Programming Abilities
| Language |
|----------|
| ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) |
| ![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white) |

### 🛠️ Aptitude & Interests
- 📟 **Embedded Systems**
- ⚡ **Electronics & Circuits**
- 🔌 **Hardware Interfacing**
- 🌐 **Internet of Things (IoT)**
- 🔋 **Power Management**

---

## 🚀 Getting Started

### Prerequisites
Node.js 18 or newer.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Icezaza2543/Comnet-Project.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server
```bash
npm start        # or: npm run serve
npm run dev      # restart automatically when files change
```
The server starts on `http://localhost:3000`. Set the `PORT` environment variable to use another port.

| Page | URL |
|------|-----|
| Dashboard (list, search, edit, delete) | `http://localhost:3000/` |
| Registration form | `http://localhost:3000/form` |

---

## 📡 API

### Student API v1

All responses are JSON in the shape `{ success, message?, data?, meta?, error?, timestamp }`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/students?query=&department=` | List students. `query` searches ID, name, and department; `department` is an exact code. `meta.stats` holds totals for all students. |
| `GET` | `/api/v1/students/:id` | Get one student |
| `POST` | `/api/v1/students` | Create a student |
| `PUT` | `/api/v1/students/:id` | Update any of `firstname`, `lastname`, `gender`, `department` (student ID cannot change) |
| `DELETE` | `/api/v1/students/:id` | Delete a student |
| `GET` | `/api/v1/system/health` | Uptime, memory, and runtime information |

Example:
```bash
curl -X POST http://localhost:3000/api/v1/students \
  -H "Content-Type: application/json" \
  -d '{"student_id":"65010001","firstname":"Somsri","lastname":"Jaidee","gender":"female","department":"CPE"}'
```

### Validation rules

| Field | Rule |
|-------|------|
| `student_id` | Required on create; exactly 8 digits |
| `firstname`, `lastname` | Required on create; non-empty string, at most 100 characters |
| `gender` | Optional; `male`, `female`, `other`, or `prefer_not_to_say` (default) |
| `department` | Optional; 2–10 letters, stored in upper case (default `CPE`) |

Unknown fields are ignored. Leading and trailing spaces are trimmed.

### Error responses

| Status | `error.code` | When |
|--------|--------------|------|
| 400 | `INVALID_STUDENT_ID`, `INVALID_STUDENT_ID_FORMAT`, `MISSING_FIRSTNAME`, `MISSING_LASTNAME`, `NAME_TOO_LONG`, `INVALID_GENDER`, `INVALID_DEPARTMENT` | A field fails validation |
| 400 | `INVALID_JSON` | The request body is not valid JSON |
| 404 | `STUDENT_NOT_FOUND` / `ROUTE_NOT_FOUND` | Unknown student or path |
| 409 | `DUPLICATE_STUDENT_ID` | The student ID already exists |
| 413 | `PAYLOAD_TOO_LARGE` | Body larger than 10 KB |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected failure (details are logged on the server only) |

### Legacy lab endpoints

Kept for backward compatibility. They use the same validation and data as API v1 but respond with `{ error, message, result }`.

| Method | Path | Response |
|--------|------|----------|
| `GET` | `/welcome` | Welcome message |
| `GET` | `/form` | Registration form page |
| `POST` | `/form` | Create a student (same rules as `POST /api/v1/students`) |
| `GET` | `/students` | All students |
| `GET` | `/student/:student_id` | One student, or 404 |
| `GET` | `/ok` | Always 200 |
| `GET` | `/release` | Always 400 (error simulation) |

---

## 📂 Project Structure
```text
├── public/                     # Dashboard (index.html), registration form (form.html), CSS
├── src/
│   ├── controllers/            # Translate HTTP requests to service calls (student, system)
│   ├── middlewares/            # Request logger, input validator, error handlers
│   ├── repositories/           # In-memory student data store
│   ├── routes/
│   │   ├── api/v1/             # RESTful routes (students, system)
│   │   └── index.js            # Legacy lab routes
│   └── services/               # Business logic and statistics
├── app.js                      # Application entry point
└── package.json
```

## ✨ Changelog
- **Security:** fixed a stored XSS in the dashboard. A crafted student ID submitted through the legacy `POST /form` could run script when someone clicked Edit or Delete. The legacy route now uses the same validator as API v1, and the dashboard reads IDs from `data-*` attributes instead of inline `onclick` handlers.
- **Validation:** non-string fields (e.g. `"firstname": 123`) now return 400 instead of crashing with 500. `gender` and `department` are checked against allowed values, and unknown fields are dropped.
- **Errors:** duplicate IDs on the legacy route return 409 instead of 500. Malformed JSON returns 400 `INVALID_JSON`. Messages of unexpected 500 errors are no longer sent to clients.
- **Cleanup:** removed unused `axios` and `path` (npm polyfill) dependencies, the broken `/jquery` and `/jquery-ui` static routes, and the unused `src/utils/utility.js`. Removed the placeholder `npm test` script that always failed. Added `npm start` and `npm run dev`.
- Earlier: layered architecture (routes → controllers → services → repository), API v1 with CRUD and health telemetry, and a dashboard with filtering, edit modal, and toasts.
