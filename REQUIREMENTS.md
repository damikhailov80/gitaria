# Gitaria — требования к сайту школы игры на гитаре

**Домен:** gitaria.pl
**Язык сайта:** русский
**Статус документа:** черновик v0.4 (2026-10-07)

---

## 1. Цель проекта

Сайт онлайн-школы игры на гитаре, который:

- знакомит посетителя со школой и преподавателем;
- продаёт платный курс игры на гитаре (первый урок бесплатный);
- даёт бесплатные полезные материалы;
- предоставляет инструменты для практики: тюнер и метроном;
- даёт ученику личный кабинет с доступом к купленным урокам.

## 2. Технологический стек

| Слой | Технология |
|---|---|
| Фреймворк | Next.js (App Router, TypeScript) |
| ORM | Prisma |
| База данных | PostgreSQL |
| Аутентификация | Auth.js (NextAuth) с адаптером Prisma |
| Платежи | Stripe (Checkout + Webhooks) |
| Стили | Tailwind CSS (предложение) |
| Хранение файлов (PDF, изображения) | S3-совместимое хранилище, например Cloudflare R2 или AWS S3 (предложение) |
| Видеохостинг | **выберем позже** (см. раздел 11) |
| Почта | Транзакционные письма, например Resend или Postmark (предложение) |
| Хостинг | Vercel или аналог (предложение) |

## 3. Роли пользователей

| Роль | Возможности |
|---|---|
| Гость | Главная страница, бесплатные материалы, тюнер, метроном, описание курса, бесплатный пробный урок |
| Зарегистрированный пользователь | Всё, что гость, плюс личный кабинет, отслеживание прогресса пробного урока, покупка курса |
| Ученик (купил курс) | Всё, что пользователь, плюс доступ ко всем урокам купленного курса |

---

## 4. Функциональные требования

### 4.1. Главная страница (Home)

- **Hero-блок:** название школы, слоган, призыв к действию («Начать бесплатный урок», «Купить курс»).
- **О школе:** подход к обучению, для кого курс (начинающие / продолжающие), чему научится ученик.
- **О преподавателе:** фото, биография, опыт, достижения, возможно короткое видео-приветствие.
- **Блок курса:** краткое описание, программа, цена, кнопка покупки и кнопка пробного урока.
- **Превью бесплатных материалов:** несколько последних или избранных материалов.
- **Ссылки на тулзы:** тюнер и метроном.
- **Соцсети:** TikTok, Instagram, Telegram, YouTube (иконки в шапке и/или футере + отдельный блок).
- **Отзывы учеников** (опционально, позже).
- **FAQ** (опционально).
- **Футер:** контакты, соцсети.

### 4.2. Курс игры на гитаре

#### Структура
- Курс → модули (опционально) → уроки.
- Поддержка нескольких курсов в модели данных, даже если на старте курс один.

#### Урок содержит
- **Видео** (одно или несколько).
- **Текст** — описание, теория, упражнения (rich text / Markdown / MDX).
- **Материалы** — прикреплённые файлы: ноты и табулатуры в PDF, Guitar Pro файлы (опционально), аудио-минусовки (опционально).
- Порядковый номер, длительность, флаг «бесплатный».

#### Доступ
- **Первый урок бесплатный** (флаг `isFree` на уроке, чтобы в будущем можно было сделать бесплатными несколько).
- Бесплатный урок доступен без регистрации.
- Остальные уроки видны в программе курса (название, описание, длительность) с иконкой замка.
- Контент закрытых уроков (видео, текст, файлы) недоступен без покупки — **проверка на сервере**, а не только скрытие в UI.
- Файлы закрытых уроков отдаются только через подписанные ссылки с ограниченным временем жизни.
- Видео закрытых уроков защищено от прямой раздачи (подписанные токены плеера / приватные видео — зависит от выбранного хостинга).

#### Прогресс
- Ученик может отметить урок как пройденный.
- Отображение прогресса по курсу (X из Y уроков, процент).
- «Продолжить с того места, где остановились».

### 4.3. Бесплатные материалы

- Каталог открытых материалов: видео, ноты и табы (PDF), тексты песен с аккордами, статьи.
- Фильтрация по типу (видео / ноты / тексты / статьи) и, опционально, по уровню сложности и тегам.
- Страница материала (`/materials/[slug]`).
- Скачивание PDF без регистрации.
- Видео можно встраивать с YouTube (это бесплатный контент, защита не нужна).

### 4.4. Тюнер

- Работает в браузере через микрофон (Web Audio API, `getUserMedia`).
- Определение высоты тона (алгоритм автокорреляции / YIN или готовая библиотека, например `pitchy`).
- Отображение: ближайшая нота, отклонение в центах (стрелка или шкала), индикатор «в строю» (например, ±5 центов).
- Строи: стандартный (E A D G B E) как минимум; опционально Drop D, полутон ниже и другие.
- Режим выбора струны вручную и автоопределение струны.
- Калибровка эталонной частоты A4 (по умолчанию 440 Гц, диапазон 430–450).
- Опционально: воспроизведение эталонного тона для настройки на слух.
- Корректная обработка отказа в доступе к микрофону и неподдерживаемых браузеров.
- Обработка звука полностью на клиенте, аудио никуда не отправляется.
- Доступен без регистрации.

### 4.5. Метроном

- Темп 30–300 BPM: слайдер, кнопки +/−, ввод числом.
- **Tap tempo.**
- Размер: 2/4, 3/4, 4/4, 6/8 и другие; акцент на первую долю.
- Выбор звука клика (минимум 2 варианта).
- Визуальная индикация долей.
- Точный тайминг: планирование звуков через `AudioContext` (паттерн lookahead scheduler), а не `setInterval`.
- Опционально: деление доли (восьмые, триоли, шестнадцатые), тренажёр постепенного увеличения темпа.
- Сохранение последних настроек в `localStorage`.
- Доступен без регистрации.

### 4.6. Личный кабинет

- **Регистрация и вход:** email (magic link или пароль) + OAuth (Google; опционально Facebook / Apple).
- **Мои курсы:** список купленных курсов с прогрессом, кнопка «Продолжить».
- **Профиль:** имя, email, аватар (опционально).
- **История покупок:** дата, курс, сумма, статус, ссылка на чек Stripe.
- **Настройки:** смена пароля (если используется).
- Опционально: избранные материалы.

### 4.7. Покупка курса через Stripe

- Кнопка «Купить» → создание **Stripe Checkout Session** на сервере → редирект в Stripe.
- Для покупки нужна авторизация (чтобы привязать доступ к аккаунту). Альтернатива — покупка по email с автоматическим созданием аккаунта (см. открытые вопросы).
- Валюта: **PLN**.
- Способы оплаты: карты, Apple Pay / Google Pay (включаются в Stripe Dashboard).
- Модель оплаты: разовая покупка.
- Счета faktura VAT не нужны.
- Поддержка промокодов Stripe.
- **Доступ выдаётся только по webhook** `checkout.session.completed` (и `checkout.session.async_payment_succeeded` для отложенных методов оплаты), а не по редиректу на success-страницу.
- Обработка webhook идемпотентна (хранить `stripeSessionId` / ID события, не выдавать доступ дважды).
- Проверка подписи webhook (`STRIPE_WEBHOOK_SECRET`).
- Обработка возврата (`charge.refunded`) → отзыв доступа.
- Страницы успешной оплаты и отмены.
- Письмо-подтверждение после покупки.

---

## 5. Нефункциональные требования

### 5.1. Производительность
- Lighthouse ≥ 90 на публичных страницах (мобильные).
- Оптимизация изображений через `next/image`.
- Ленивая загрузка видеоплеера.

### 5.2. Адаптивность и доступность
- Mobile-first: тюнер и метроном особенно часто будут открывать с телефона.
- Базовая доступность (WCAG 2.1 AA): контраст, навигация с клавиатуры, alt-тексты.

### 5.3. Безопасность
- Проверка доступа к платному контенту на сервере (server components / route handlers / middleware).
- Подписанные URL с коротким TTL для платных файлов и видео.
- Секреты только в переменных окружения.
- Rate limiting на auth- и payment-эндпоинтах.
- CSRF-защита (встроена в Auth.js), валидация входных данных (например, `zod`).

### 5.4. Аналитика
- Privacy-friendly аналитика (Plausible / Umami) или GA4.
- Воронка: посещение → пробный урок → покупка.

---

## 6. Черновик модели данных (Prisma)

```prisma
enum PurchaseStatus {
  PENDING
  PAID
  REFUNDED
  FAILED
}

enum MaterialType {
  VIDEO
  SHEET_MUSIC
  LYRICS
  ARTICLE
}

model User {
  id            String     @id @default(cuid())
  email         String     @unique
  name          String?
  image         String?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  accounts      Account[]  // Auth.js
  sessions      Session[]  // Auth.js
  purchases     Purchase[]
  enrollments   Enrollment[]
  progress      LessonProgress[]
}

model Course {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String
  coverImage  String?
  priceAmount Int      // в грошах (минимальных единицах валюты)
  currency    String   @default("pln")
  stripePriceId String?
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  modules     Module[]
  lessons     Lesson[]
  purchases   Purchase[]
  enrollments Enrollment[]
}

model Module {
  id       String   @id @default(cuid())
  courseId String
  course   Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title    String
  order    Int
  lessons  Lesson[]
}

model Lesson {
  id          String   @id @default(cuid())
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  moduleId    String?
  module      Module?  @relation(fields: [moduleId], references: [id])
  slug        String
  title       String
  summary     String?
  content     String   // Markdown / MDX
  videoProvider String? // зависит от выбранного хостинга
  videoId     String?
  durationSec Int?
  order       Int
  isFree      Boolean  @default(false)
  isPublished Boolean  @default(false)

  attachments Attachment[]
  progress    LessonProgress[]

  @@unique([courseId, slug])
}

model Attachment {
  id        String  @id @default(cuid())
  lessonId  String
  lesson    Lesson  @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  title     String
  fileKey   String  // ключ в S3/R2
  mimeType  String
  sizeBytes Int
}

model Enrollment {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  courseId  String
  course    Course   @relation(fields: [courseId], references: [id])
  grantedAt DateTime @default(now())
  revokedAt DateTime?
  source    String   // "stripe" | "manual"

  @@unique([userId, courseId])
}

model Purchase {
  id                    String         @id @default(cuid())
  userId                String
  user                  User           @relation(fields: [userId], references: [id])
  courseId              String
  course                Course         @relation(fields: [courseId], references: [id])
  stripeCheckoutSessionId String       @unique
  stripePaymentIntentId String?        @unique
  amount                Int
  currency              String
  status                PurchaseStatus @default(PENDING)
  createdAt             DateTime       @default(now())
  updatedAt             DateTime       @updatedAt
}

model StripeEvent {
  id          String   @id // ID события Stripe, для идемпотентности
  type        String
  processedAt DateTime @default(now())
}

model LessonProgress {
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  completedAt DateTime?
  lastViewedAt DateTime @default(now())

  @@id([userId, lessonId])
}

model Material {
  id          String       @id @default(cuid())
  slug        String       @unique
  type        MaterialType
  title       String
  description String?
  content     String?      // текст / статья / аккорды
  videoUrl    String?      // напр. YouTube
  fileKey     String?      // PDF в S3/R2
  tags        String[]
  level       String?      // beginner / intermediate / advanced
  isPublished Boolean      @default(false)
  createdAt   DateTime     @default(now())
}

// + стандартные модели Auth.js: Account, Session, VerificationToken
```

---

## 7. Структура страниц (маршруты)

| Маршрут | Доступ | Описание |
|---|---|---|
| `/` | публичный | Главная |
| `/course` | публичный | Описание курса, программа, цена (курс один) |
| `/course/[lessonSlug]` | бесплатный урок — публичный, без регистрации; остальные — ученик | Урок |
| `/materials` | публичный | Каталог бесплатных материалов |
| `/materials/[slug]` | публичный | Материал |
| `/tools/tuner` | публичный | Тюнер |
| `/tools/metronome` | публичный | Метроном |
| `/login`, `/register` | публичный | Вход / регистрация |
| `/account` | пользователь | Личный кабинет: мои курсы |
| `/account/profile` | пользователь | Профиль и настройки |
| `/account/purchases` | пользователь | История покупок |
| `/checkout/success`, `/checkout/cancel` | пользователь | Результат оплаты |
| `/api/stripe/webhook` | Stripe | Webhook |
| `/api/files/[id]` | по правам | Выдача подписанных ссылок на файлы |

---

## 8. Интеграция со Stripe — поток

1. Пользователь (авторизован) нажимает «Купить».
2. Сервер проверяет, что курс ещё не куплен, создаёт `Purchase` (PENDING) и Checkout Session с `metadata: { userId, courseId, purchaseId }`.
3. Редирект на Stripe Checkout.
4. Stripe отправляет webhook → сервер проверяет подпись → проверяет `StripeEvent` на дубликат → в транзакции переводит `Purchase` в PAID и создаёт `Enrollment`.
5. Пользователь попадает на `/checkout/success`, где видит статус (с повторным опросом, если webhook ещё не пришёл).
6. Отправляется письмо-подтверждение.

---

## 9. Переменные окружения

```
DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
EMAIL_API_KEY=
EMAIL_FROM=
NEXT_PUBLIC_SITE_URL=https://gitaria.pl
# + переменные видеохостинга после выбора
```

---

## 10. Этапы (предложение)

1. **MVP-1 — витрина:** главная, тюнер, метроном, бесплатные материалы.
2. **MVP-2 — курс:** авторизация, модель курса и уроков, бесплатный урок, защищённые уроки, загрузка файлов.
3. **MVP-3 — продажи:** Stripe Checkout, webhooks, выдача доступа, письма, история покупок.
4. **v1.1:** прогресс уроков, аналитика, отзывы.

---

## 11. Видеохостинг (выбор позже)

Требования к хостингу платных видео:

- приватные видео с подписанными токенами / ограничением по домену;
- адаптивный стриминг (HLS);
- хорошая скорость в Польше и ЕС;
- API для загрузки и получения статуса обработки;
- желательно — аналитика просмотров.

Кандидаты для сравнения: **Bunny Stream**, **Mux**, **Cloudflare Stream**, **Vimeo (Pro/Business)**.
Для бесплатных материалов достаточно встраивания с YouTube.

Модель данных уже предусматривает `videoProvider` + `videoId`, чтобы не зависеть от конкретного провайдера.

---

## 12. Открытые вопросы

1. Покупка без предварительной регистрации (аккаунт создаётся по email из Stripe) — нужна ли?
2. Формат контента уроков: Markdown/MDX в БД или headless CMS?
3. Видеохостинг — см. раздел 11.
4. Дизайн: есть ли брендбук, логотип, цвета, фотографии преподавателя?
5. Ссылки на соцсети (TikTok, Instagram, Telegram, YouTube) — конкретные URL.
