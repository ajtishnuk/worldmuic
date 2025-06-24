# WorldMusic Web App — Технічна документація

## 🔍 Загальний опис

**WorldMusic** — це сучасний вебзастосунок для перегляду найпопулярніших музичних відео YouTube з можливістю:
- авторизації через Google (OAuth 2.0),
- фільтрації за країнами,
- виставлення оцінок (від 1 до 10),
- перегляду середнього рейтингу кожного відео.

---

## ⚙️ Технології

| Сторона        | Стек                   |
|----------------|------------------------|
| Frontend       | React.js, JavaScript, HTML/CSS |
| Backend        | Node.js, Express.js    |
| База даних     | PostgreSQL             |
| Авторизація    | Google OAuth 2.0       |
| API відео      | YouTube Embed API      |

---

## 🗂️ Структура проєкту

```
prg/
├── backend/
│   ├── index.js                # Точка входу Express-серверу
│   ├── passport.js             # Конфіг Google OAuth
│   ├── db.js                   # Підключення до PostgreSQL
│   └── routes/
│       ├── auth.js             # Роути авторизації
│       ├── youtube.js          # Отримання відео
│       └── rating.js           # Оцінювання відео
├── frontend/
│   ├── src/
│   │   ├── App.jsx             # AuthContext + маршрути
│   │   ├── Home.jsx            # Головна сторінка
│   │   ├── Login.jsx           # Сторінка входу
│   │   └── index.js            # Точка входу React
```

---

## 🧩 База даних

### Таблиця `users`

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  google_id TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  email TEXT,
  last_login TIMESTAMP
);
```

### Таблиця `ratings`

```sql
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  video_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at TIMESTAMP NOT NULL
);
```

---

## 🌐 API

### Авторизація

- `GET /auth/user` — отримати інформацію про залогіненого користувача
- `POST /auth/logout` — вийти з системи

### Відео

- `GET /api/videos?country=UA` — список відео по країні

### Рейтинг

- `POST /api/rate` — оцінити відео
- `GET /api/rating/:videoId` — отримати середню оцінку

---

## 🧑‍💻 Основні компоненти

### 🔐 Авторизація

- Відбувається через Google.
- Дані про користувача зберігаються або оновлюються у таблиці `users`.
- Сесія підтримується через cookie (httpOnly).

### 🏠 Головна сторінка (`Home.jsx`)

- Доступна лише авторизованим користувачам.
- Виводить:
  - назву відео,
  - відео через YouTube embed,
  - форму оцінювання,
  - середній бал.
- Можна обрати країну (USA, UK, Ukraine, Japan, Korea, India).
- Після оцінювання — надсилається POST на `/api/rate`.

### 🔑 Сторінка логіну (`Login.jsx`)

- Виводить кнопку "Login with Google".
- Після логіну користувача редіректить на `/home`.

---

## 🎨 UI/UX Покращення

- Центрування всіх елементів.
- Приємна кольорова схема: світло-сірий хедер, округлі кнопки.
- Стильний список відео з відступами.
- Інформативна панель привітання з іменем користувача та часом останнього входу.

---

## 🚀 Розгортання

### Backend

```bash
cd backend
npm install
node index.js
```

🔑 Не забудьте створити `.env`:

```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
BASE_URL=http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install
npm start
```

📝 Frontend за замовчуванням запускається на `http://localhost:3000`.

---

## 👤 Автор

- Розробник: **Микола Висоцький**
- GitHub: [github.com/ajtishnuk](https://github.com/ajtishnuk)
- Email: ajtishnuk@gmail.com

---

