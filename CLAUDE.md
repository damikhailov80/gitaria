@AGENTS.md

# Gitaria

Сайт школы игры на гитаре **gitaria.pl**: главная, онлайн-курс «Гитара с нуля» (первый урок бесплатный),
открытые материалы, тюнер, метроном, личный кабинет, оплата через Stripe.
Полные требования — в [REQUIREMENTS.md](REQUIREMENTS.md).

## Текущий этап

- Вёрстка всех экранов по макету. Авторизации нет, все страницы открыты.
- Данные — моки из `src/lib/mock/`. Prisma/PostgreSQL, Auth.js, Stripe и видеохостинг подключим позже.
- Тюнер и метроном — рабочие (Web Audio API).
- Кнопка «Записаться на урок» (офлайн-уроки) пока никуда не ведёт — куда вести, не решено.

## Стек и команды

Next.js 16 (App Router, TypeScript, Cache Components), React 19, CSS Modules, без Tailwind.

```bash
npm run dev     # dev-сервер
npm run build   # сборка + проверка типов
npm run lint    # ESLint
```

## Структура

```
src/app/                    страницы (маршруты — см. REQUIREMENTS.md, раздел 7)
  page.tsx                  главная
  course/                   страница курса; [lessonSlug]/ — урок
  materials/                открытые материалы (фильтр на клиенте)
  tools/tuner/              тюнер (микрофон + pitchy)
  tools/metronome/          метроном
  account/ checkout/ login/ кабинет, оплата, вход
src/components/             общие компоненты (Header, Logo, Icon, LessonRow, …)
src/lib/types.ts            типы по модели данных из REQUIREMENTS.md
src/lib/mock/               моки: курс, материалы, школа, пользователь
src/lib/audio/              pitch.ts (частота → нота/центы), tunings.ts, metronome.ts (планировщик)
design/                     PNG-экраны макета из Claude Design — эталон вёрстки
```

## Правила

- **Делать только то, что попросили.** Не добавлять фичи, разделы, страницы и требования сверх запроса. Если что-то кажется нужным — спросить.
- Цвета — только через CSS-переменные из `src/app/globals.css` (`--color-*`). Никаких hex в компонентах.
  Общие классы там же: `.btn`, `.tag`, `.segmented`, `.input`, `.eyebrow`, `.container`.
- Вёрстка по макету в `design/`; на узких экранах колонки складываются в одну, боковой отступ 16px.
- Интерфейс только на русском. Цены в злотых (`formatPrice` из `src/lib/mock/course.ts`).
- Страницы получают данные из моков через функции/константы `src/lib/mock`, чтобы потом заменить их на Prisma без переделки вёрстки.
