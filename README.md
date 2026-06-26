# JobSearcher 🚀

Aplicación móvil de búsqueda de empleos desarrollada con **React Native + Expo SDK 52**, siguiendo arquitectura **Clean Architecture**.

Desarrollado como prueba técnica para **RedArbor**.

---

## 📱 Funcionalidades

- ✅ Listado de empleos con búsqueda y filtros (texto, categoría, tipo)
- ✅ Detalle de empleo con descripción HTML renderizada (parser custom con `htmlparser2`)
- ✅ Sistema de favoritos con persistencia local (AsyncStorage)
- ✅ Compartir empleos (Share API nativo)
- ✅ Aplicar a empleos (abrir URL externa con Linking)
- ✅ Pull-to-refresh
- ✅ Estados visuales (loading, error, empty states)
- ✅ Listas performantes con FlashList
- ✅ Modo oscuro/claro con sistema de temas
- ✅ Internacionalización (i18n) con español e inglés
- ✅ Navegación con tabs (Jobs, Favorites) + pantalla de detalle
- ✅ Componentes reutilizables (EmptyState, LoadingState, JobCard, etc.)

---

## 🛠 Stack Tecnológico

| Categoría            | Tecnología                                | Versión |
| -------------------- | ----------------------------------------- | ------- |
| Framework            | React Native + Expo SDK                   | 52.0.49 |
| Navegación           | Expo Router                               | 4.0.x   |
| State Management     | Zustand                                   | 5.0.x   |
| HTTP Client          | Axios                                     | 1.18.x  |
| Listas               | @shopify/flash-list                       | 1.7.3   |
| HTML Parsing         | htmlparser2                               | 10.x    |
| Persistencia         | @react-native-async-storage/async-storage | 2.x     |
| Internacionalización | react-i18next                             | 15.x    |
| Lenguaje             | TypeScript                                | 5.9.x   |

---

## 📋 Requisitos Previos

### Obligatorio

- **Node.js** 20.x o superior
- **npm** 10.x o superior
- **Git**

### Para iOS (macOS)

- **macOS** 13 o superior
- **Xcode** 15 o 16
- **CocoaPods** (`sudo gem install cocoapods`)
- **iOS Simulator** (instalado con Xcode)

### Para Android

- **Android Studio** con SDK instalado
- **Android SDK** API 33 o superior
- **Java Development Kit (JDK)** 17

> ⚠️ **Importante sobre JDK**: Expo recomienda usar **Azul Zulu JDK** en lugar del JDK estándar de Oracle. Zulu JDK es compatible con React Native y evita problemas de compilación en Android.

#### 🟢 Instalar Azul Zulu JDK (Recomendado)

**Opción 1: Con Homebrew (macOS)**

```bash
# Instalar Zulu JDK 17
brew install --cask zulu@17

# Verificar instalación
java -version
```

**Opción 2: Descarga directa**

1. Ve a [Azul Zulu Downloads](https://www.azul.com/downloads/?version=java-17-lts&os=macos&architecture=arm-64-bit&package=jdk#zulu)
2. Descarga **Zulu JDK 17** para tu arquitectura (ARM o x86)
3. Instala el `.dmg` o `.pkg`
4. Configura `JAVA_HOME` en tu `~/.zshrc` o `~/.bash_profile`:

```bash
# Agregar al final del archivo
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH
```

5. Recargar configuración:

```bash
source ~/.zshrc  # o source ~/.bash_profile
```

**Opción 3: Con SDKMAN (Multiplataforma)**

```bash
# Instalar SDKMAN
curl -s "https://get.sdkman.io" | bash
source ~/.sdkman/bin/sdkman-init.sh

# Instalar Zulu JDK 17
sdk install java 17.0.9-zulu

# Usar como default
sdk default java 17.0.9-zulu
```

#### 🔴 ¿Por qué NO usar Oracle JDK?

- ❌ Problemas de licencia en producción
- ❌ Incompatibilidades con React Native
- ❌ Errores de compilación en Android Gradle
- ❌ No soportado oficialmente por Expo

#### ✅ Verificar JDK Correcto

```bash
# Debe mostrar "Zulu" en el output
java -version

# Output esperado:
# openjdk version "17.0.9" 2023-10-17 LTS
# OpenJDK Runtime Environment Zulu17.46+19-CA (build 17.0.9+9-LTS)
# OpenJDK 64-Bit Server VM Zulu17.46+19-CA (build 17.0.9+9-LTS, mixed mode, sharing)
```

Si ves "Zulu" en el output, estás listo. ✅

### Verificar Instalación

```bash
# Verificar versiones
node --version       # v20.x.x o superior
npm --version        # 10.x.x o superior
git --version        # 2.x.x

# iOS (macOS)
xcodebuild -version  # Xcode 15+
pod --version        # 1.15+

# Android
java -version        # Zulu JDK 17
```

---

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/chrisballack/JobSearcher.git
cd JobSearcher
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Editar `.env` con tu configuración:

```env
EXPO_PUBLIC_API_URL=https://remotive.com/api
```

### 4. Generar proyectos nativos

```bash
npx expo prebuild --clean
```

> ⚠️ **Usuarios de Xcode 16+**: Después de ejecutar `prebuild --clean`, debes aplicar el parche de `fmt` manualmente:
>
> ```bash
> node scripts/patch-fmt.js
> ```

### 5. Ejecutar la app

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android

# Development server (con QR code para Expo Go)
npx expo start
```

> 💡 La app inicia directamente en la pestaña **Jobs** (listado de empleos).

---

## ⚠️ Problema Conocido: Xcode 16+ y `fmt`

### 🔴 Descripción del Problema

Si estás usando **Xcode 16 o superior**, encontrarás este error al compilar para iOS:

```
❌ (ios/Pods/fmt/include/fmt/base.h:134:24)
call to consteval function 'fmt::basic_format_string<...>' is not a constant expression
```

### 🎯 Causa

React Native SDK 52 usa la librería `fmt 8.x`, que tiene un bug de compatibilidad con **Apple Clang 16+**. El código usa `consteval` (feature C++20) de una forma que el compilador de Xcode 16 no acepta.

### ✅ Solución Automática (Incluida en el Proyecto)

El proyecto incluye un **script automático** que resuelve este problema:

**Archivo:** `scripts/patch-fmt.js`

Este script:

1. Busca el archivo `ios/Pods/fmt/include/fmt/base.h`
2. Cambia los permisos de solo lectura a escritura
3. Reemplaza `consteval` por `constexpr` (compatible con Xcode 16)
4. Se ejecuta automáticamente en cada `npm install` gracias al `postinstall`

### 🔧 Verificación Manual

Si quieres verificar que el parche se aplicó correctamente:

```bash
# Ver el contenido de la línea problemática
grep -n "FMT_CONSTEVAL" ios/Pods/fmt/include/fmt/base.h
```

**Resultado esperado:**

```
134:#  define FMT_CONSTEVAL constexpr
```

Si ves `constexpr` en lugar de `consteval`, el parche está aplicado. ✅

### 🛠 Aplicar el Parche Manualmente

Si por alguna razón el parche no se aplicó automáticamente:

```bash
# 1. Cambiar permisos del archivo
chmod u+w ios/Pods/fmt/include/fmt/base.h

# 2. Ejecutar el script manualmente
node scripts/patch-fmt.js

# 3. Verificar
grep -n "FMT_CONSTEVAL" ios/Pods/fmt/include/fmt/base.h

# 4. Compilar
npx expo run:ios
```

### 📌 Nota Importante sobre Persistencia

Cada vez que ejecutes `npx expo prebuild --clean` o `pod install`, los archivos en `ios/Pods/` se regeneran y **pierden el parche**. Por eso:

- ✅ Después de `prebuild --clean`, ejecuta `node scripts/patch-fmt.js` manualmente
- ❌ **NUNCA** ejecutes `rm -rf ios/build` (rompe el Codegen)

---

## 📁 Estructura del Proyecto

```
JobSearcher/
├── app/                              # Expo Router (navegación por archivos)
│   ├── _layout.tsx                  # Layout raíz con providers
│   ├── index.tsx                    # Redirect inicial → /(tabs)/jobs
│   ├── (tabs)/                      # Tab navigation
│   │   ├── _layout.tsx              # Layout de tabs (Jobs, Favorites)
│   │   ├── jobs/
│   │   │   └── index.tsx            # Listado de empleos
│   │   └── favorites/
│   │       └── index.tsx            # Favoritos
│   └── detail/
│       └── [id].tsx                 # Detalle de empleo (fuera de tabs)
├── src/
│   ├── core/                        # Configuración y utilidades
│   │   ├── constants/               # Config, TTLs, cache keys
│   │   ├── design-system/           # Tokens de diseño (spacing, colors, etc.)
│   │   ├── errors/                  # AppError, error codes
│   │   ├── i18n/                    # Internacionalización (es, en)
│   │   ├── theme/                   # Sistema de temas (light/dark)
│   │   ├── types/                   # Tipos globales (Cache, etc.)
│   │   └── utils/                   # Helpers reutilizables (htmlRenderer, formatters)
│   ├── domain/                      # Capa de dominio (pura)
│   │   ├── entities/                # Job, Category
│   │   ├── repositories/            # Interfaces de repositorios
│   │   └── usecases/                # Casos de uso (GetJobs, GetCategories, etc.)
│   ├── data/                        # Capa de datos
│   │   ├── datasources/
│   │   │   └── remote/              # API calls (Axios)
│   │   ├── dto/                     # DTOs y mappers (JobMapper)
│   │   └── repositories/            # Implementaciones
│   ├── presentation/                # Capa de presentación
│   │   ├── components/              # Componentes reutilizables
│   │   │   ├── common/              # EmptyState, LoadingState
│   │   │   └── detail/              # JobDetailHeader, InfoSection, Tags, Actions, etc.
│   │   ├── hooks/                   # Custom hooks (useJobs, useCategories, useFavorites)
│   │   └── stores/                  # Zustand stores (jobsStore, favoritesStore)
│   └── infrastructure/              # Infraestructura
│       ├── http/                    # ApiService (Axios)
│       ├── di/                      # ServiceFactory (DI)
│       └── storage/                 # CacheStorage (AsyncStorage)
├── scripts/
│   └── patch-fmt.js                # 🔧 Parche para Xcode 16+
├── patches/                         # Parches de dependencias (patch-package)
├── assets/                          # Imágenes, fuentes, iconos
├── app.json                         # Configuración Expo
├── package.json                     # Dependencias y scripts
├── tsconfig.json                    # Configuración TypeScript
├── .env.example                     # Template de variables de entorno
└── README.md                        # Este archivo
```

---

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm start              # Inicia Expo dev server
npm run ios            # Ejecuta en iOS simulator
npm run android        # Ejecuta en Android emulator

# Testing
npm test               # Ejecuta tests con Jest
npm test -- --coverage # Tests con coverage
npm test -- --watch    # Watch mode

# Linting
npm run lint           # Ejecuta ESLint

# Parche manual (si es necesario)
node scripts/patch-fmt.js
```

---

## 🏗️ Arquitectura

### Clean Architecture

El proyecto sigue el patrón **Clean Architecture** con separación clara de responsabilidades:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Screens, Components, Hooks, Stores)   │
├─────────────────────────────────────────┤
│           Domain Layer                  │
│  (Entities, UseCases, Repositories)     │
├─────────────────────────────────────────┤
│            Data Layer                   │
│  (DataSources, DTOs, Mappers)           │
├─────────────────────────────────────────┤
│         Infrastructure                  │
│  (ApiService, DI, Storage)              │
└─────────────────────────────────────────┘
```

### Flujo de Datos

```
UI (Screen)
   ↓ usa
Hook (useJobs, useFavorites)
   ↓ invoca
UseCase (Domain)
   ↓ usa
Repository (Interface)
   ↓ implementado por
RepositoryImpl (Data)
   ↓ usa
DataSource (Remote)
   ↓ consume
API / AsyncStorage
```

### Dependency Injection

Se usa **ServiceFactory** (Singleton) para inyección de dependencias:

```typescript
const factory = ServiceFactory.getInstance();
const getJobsUseCase = factory.getGetJobsUseCase();
const jobs = await getJobsUseCase.execute(params);
```

### State Management (Zustand)

Se usan **Zustand stores** para estado global compartido entre pantallas:

- **`favoritesStore`**: Sincroniza favoritos entre JobsScreen y FavoritesScreen
- **`jobsStore`**: Permite acceder a jobs completos desde el detalle sin pasar por params

```typescript
// Selector reactivo
const isFav = useFavoritesStore((state) =>
  state.favorites.some((f) => f.id === jobId),
);
```

### Estrategias de Cache

| Tipo de dato      | TTL   | Estrategia             |
| ----------------- | ----- | ---------------------- |
| Categorías        | 24h   | Cache-First            |
| Empleos (listado) | 15min | Stale-While-Revalidate |
| Favoritos         | ∞     | Local (AsyncStorage)   |

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Convenciones de Testing

- Archivos de test: `*.test.ts` o `*.test.tsx`
- Ubicación: junto al archivo que testean
- Mocks: en carpeta `__mocks__/`
- Framework: Jest + React Native Testing Library

---

## 📦 Builds de Producción

### iOS

```bash
# Build local
npx expo run:ios --configuration Release

# EAS Build (recomendado)
npm install -g eas-cli
eas login
eas build --platform ios
```

### Android

```bash
# Build local
npx expo run:android --variant release

# EAS Build (recomendado)
eas build --platform android
```

### Generar APK/AAB para Android

```bash
cd android
./gradlew assembleRelease  # APK
./gradlew bundleRelease    # AAB (Play Store)
```

---

## 🔧 Troubleshooting

### ❌ Error: `fmt` consteval en iOS (Xcode 16+)

**Síntoma:**

```
call to consteval function 'fmt::basic_format_string<...>' is not a constant expression
```

**Solución:**

```bash
# Aplicar parche manualmente
chmod u+w ios/Pods/fmt/include/fmt/base.h
node scripts/patch-fmt.js

# Verificar
grep -n "FMT_CONSTEVAL" ios/Pods/fmt/include/fmt/base.h

# Compilar
npx expo run:ios
```

Ver sección completa: [Problema Conocido: Xcode 16+ y fmt](#-problema-conocido-xcode-16-y-fmt)

---

### ❌ Error: Codegen files not found

**Síntoma:**

```
Build input file cannot be found: '.../generated/ios/...'
```

**Causa:** Se eliminó `ios/build` manualmente.

**Solución:**

```bash
# NO eliminar ios/build
# Regenerar con prebuild
npx expo prebuild --platform ios
npx expo run:ios
```

---

### ❌ Error: Android build falla con JDK incorrecto

**Síntoma:**

```
FAILURE: Build failed with an exception.
* What went wrong:
Could not determine the dependencies of ':app:compileDebugJavaWithJavac'.
> Unsupported class file major version 61
```

**Causa:** Estás usando Oracle JDK o una versión incompatible.

**Solución:**

```bash
# 1. Verificar JDK actual
java -version

# 2. Si NO es Zulu JDK, instalar:
brew install --cask zulu@17

# 3. Configurar JAVA_HOME
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home

# 4. Limpiar y reconstruir
cd android
./gradlew clean
cd ..
npx expo run:android
```

---

## 📝 Convenciones de Código

### Nombres de Archivos

| Tipo         | Convención           | Ejemplo                |
| ------------ | -------------------- | ---------------------- |
| Componentes  | PascalCase           | `JobCard.tsx`          |
| Screens      | PascalCase           | `JobsScreen.tsx`       |
| Stores       | camelCase + Store    | `jobsStore.ts`         |
| UseCases     | PascalCase + UseCase | `GetJobsUseCase.ts`    |
| Repositories | PascalCase + Impl    | `JobRepositoryImpl.ts` |
| Hooks        | camelCase + use      | `useJobs.ts`           |
| Utils        | camelCase            | `htmlRenderer.tsx`     |
| Types        | PascalCase           | `Job.ts`               |

### TypeScript

- Configuración **estricta** habilitada
- Sin `any` explícitos
- Todos los parámetros tipados
- Interfaces sobre types cuando sea posible

### Estructura de Componentes

```typescript
// 1. Imports
import { ... } from "react-native";
import { ... } from "@/core/...";

// 2. Types / Interfaces
interface ComponentProps { ... }

// 3. Constants
const CONSTANTS = { ... };

// 4. Component
export default function Component({ ... }: ComponentProps) {
  // Hooks
  // Handlers
  // Renderers
  // Return JSX
}

// 5. Styles
const styles = StyleSheet.create({ ... });
```

---

## 🌐 Variables de Entorno

| Variable              | Descripción                | Ejemplo                    |
| --------------------- | -------------------------- | -------------------------- |
| `EXPO_PUBLIC_API_URL` | URL base de la API         | `https://remotive.com/api` |
| `EXPO_PUBLIC_ENV`     | Entorno (dev/staging/prod) | `development`              |

Crear archivo `.env` basado en `.env.example`.

---

## 👥 Autor

**Christians Bonilla**
Prueba técnica para RedArbor - Junio 2026

---

**¡Gracias por revisar el proyecto!** 🚀
