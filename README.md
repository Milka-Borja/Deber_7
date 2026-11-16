<div align="center">

# ✦ Ritual · Habit Tracker

**App móvil para construir hábitos con constancia, hecha con Expo + React Native y respaldada por Supabase.**

[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## 📖 Descripción

**Ritual** es una app de seguimiento de hábitos con una interfaz oscura y cuidada, diseñada a partir de un archivo de Figma. Permite crear hábitos, programarlos por días de la semana, marcar su cumplimiento diario y visualizar el progreso a lo largo del tiempo — todo sincronizado en la nube con Supabase.

### ✨ Características

- **📅 Vista «Hoy»** — semana navegable, hábitos del día seleccionado, progreso diario y barras de horario por hora.
- **📈 Vista «Progreso»** — resumen de estadísticas (racha, total, cumplimiento) y gestión rápida de hábitos.
- **🗂 Vista «Colección»** — todos tus hábitos con su categoría, días programados y estado.
- **⚙️ Vista «Ajustes»** — cuenta, objetivo diario, notificaciones, apariencia, idioma y sincronización.
- **➕ CRUD completo** — crear, editar y eliminar hábitos desde un modal con validación.
- **🎨 Diseño propio** — tab bar personalizada, fondos animados con *blooms* ambientales, tipografía Inter y sistema de tokens de color.
- **☁️ Sync en la nube** — todo persiste en la tabla `habits` de Supabase.

## 🛠 Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Framework | Expo SDK 57 · React Native 0.86 · React 19 |
| Navegación | React Navigation v7 (`createBottomTabNavigator`) |
| Backend | Supabase (PostgreSQL + RLS) |
| Animaciones | React Native Reanimated 4 · Gesture Handler |
| Tipografía | Inter (`@expo-google-fonts/inter`) |
| Lenguaje | JavaScript con tipos via JSDoc · TypeScript solo para config |
| Lint | ESLint (`eslint-config-expo`) |

## 🚀 Arranque rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de entorno (ver abajo)
cp .env.example .env

# 3. Arrancar el dev server
npx expo start
```

Luego escanea el QR con **Expo Go** (Android/iOS) o pulsa `a` / `i` / `w` para abrir en emulador o web.

### Variables de entorno

Crea un archivo `.env` en la raíz (ya está en `.gitignore`, nunca se sube):

```env
EXPO_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=<tu-publishable-key>
```

> 🔑 Usa la **publishable/anon key**, nunca la `service_role`. Con RLS habilitado es suficiente y seguro para el cliente.

## 📦 Comandos

| Comando | Qué hace |
| --- | --- |
| `npx expo start` | Dev server con Metro |
| `npx expo start --android` | Abre en emulador/dispositivo Android |
| `npx expo start --ios` | Abre en emulador/dispositivo iOS |
| `npx expo start --web` | Abre en el navegador |
| `npx expo lint` | Lint con ESLint |
| `npx tsc --noEmit` | Typecheck |
| `npx expo export --platform android` | Bundle de producción |
| `npx expo-doctor` | Diagnóstico de dependencias/config |

## 🏗 Arquitectura

```
index.js  →  App.js                     entrada + navegación + fuentes
  └─ HabitsProvider (Context)           estado global + CRUD Supabase
       └─ Tab.Navigator (4 pestañas)
            Hoy       → src/screens/today-screen.js
            Progreso  → src/screens/progress-screen.js
            Colección → src/screens/collection-screen.js
            Ajustes   → src/screens/settings-screen.js
```

```
src/
├── components/        UI reutilizable
│   ├── create-habit-modal.js    modal de crear/editar
│   ├── dashboard-cards.js       tarjetas de estadísticas
│   ├── habit-card.js            tarjeta de hábito
│   ├── ritual-background.js     blooms ambientales
│   └── ritual-tab-bar.js        tab bar personalizada
├── hooks/
│   └── use-habits.js            Context + todo el CRUD y stats
├── lib/
│   └── supabase.js              cliente de Supabase
├── screens/                     las 4 pantallas
└── theme/
    ├── ritual.js                tokens de color/tipografía + días
    ├── icons.js                 iconos SVG inline
    └── dates.js                 utilidades de fechas
```

**Decisiones clave:**

- **Navegación:** React Navigation v7 con `createBottomTabNavigator` y un `tabBar` propio — *no* se usa Expo Router.
- **Datos:** Supabase REST sobre la tabla `habits` con RLS «Acceso total público» (select/insert/update/delete con la anon key).
- **Aliases:** los imports usan `@/*` → `./src/*` y `@/assets/*` → `./assets/*` (definidos en `tsconfig.json`).
- **Fuentes:** se importan los pesos de Inter por subpath individual para no cargar los 18 variantes (~6 MB).
- **React Compiler** está habilitado en `app.json` (`experiments.reactCompiler`).

## 🗄 Esquema `habits`

```sql
id             uuid        default gen_random_uuid()
name           text        not null
days_of_week   text        not null      -- "L,M,X,J,V,S,D"
category       text                      -- SALUD | MENTE | ENFOQUE | ENERGÍA
reminder_time  text                      -- "07:00"
goal           text                      -- "2 litros"
description    text
is_completed   boolean     default false
created_at     timestamptz default now()
```

## ⚠️ Notas

- `EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK=1` en `.env` es necesario porque Expo Router sigue instalado como dependencia transitiva de `@expo/cli` y bloquearía los imports de `@react-navigation/*`.
- `expo-env.d.ts` es un archivo **generado** (está en `.gitignore`). Si `npx tsc --noEmit` falla con errores de imports de `.css`, regeneralo con `npx expo start` o vuelve a crearlo con `/// <reference types="expo/types" />`.
- `ios/` y `android/` son generados por Continuous Native Generation — nunca se editan a mano; la config nativa vive en `app.json`.
- Tras agregar una librería con código nativo, hace falta un development build (`npx expo run:ios|android`), no Expo Go.

## 📄 Licencia

[MIT](LICENSE)
