# 🌐 Computer Network Project

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

A beautifully structured Node.js and Express.js server built for a Computer Network laboratory project.

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
Make sure you have Node.js installed on your machine.

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
npm run serve
```
The server will start on `http://localhost:3000`.

---

## 📂 Project Structure
```text
├── public/             # Static files (HTML, CSS)
├── src/                # Source code
│   ├── routes/         # Express routes (API & Web)
│   └── utils/          # Helper functions & utilities (e.g. utility.js)
├── app.js              # Application entry point
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

## ✨ Refactoring Details
- Organized logic into `routes` and `utils` folders.
- Upgraded deprecated `request-promise` to `axios` for external API requests.
- Converted old callbacks to modern `async/await` logic for better readability.
- Added `express.json()` middleware.
