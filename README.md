# Payment Checkout App

Una aplicación móvil de React Native para procesamiento de pagos con tarjeta de crédito, catálogo de productos completo y funcionalidad de carrito de compras.

## 🎬 Demo de la Aplicación

![App Demo](./demo-2.gif)

*Demostración completa del flujo de la aplicación: navegación por productos, carrito de compras y procesamiento de pagos*

## 📱 Instaladores Listos

En la carpeta `apps-installers/` encontrarás los instaladores compilados:

- **Android**: `CheckoutApp.apk` - Instalador para dispositivos Android
- **iOS**: `CheckoutApp.ipa` - Instalador para dispositivos iOS (requiere certificado de desarrollador)

```
apps-installers/
├── CheckoutApp.apk     # Instalador Android
└── CheckoutApp.ipa     # Instalador iOS
```

## 🔗 Backend API

Esta aplicación móvil se conecta con un backend desarrollado en **NestJS**:

**🔧 Repositorio Backend:** [backend-nest-payment-checkout](https://github.com/sergiovegam41/backend-nest-payment-checkout)

**Características del Backend:**
- 🏗️ **NestJS** con TypeScript
- 🗄️ **Base de datos** PostgreSQL
- 🔐 **Validación** de datos y seguridad
- 📡 **API RESTful** para procesamiento de pagos
- 🧪 **Documentación** con Swagger/OpenAPI
- 🚀 **Desplegado** en producción

**Endpoints Principales:**
- `POST /api/v1/product-checkout` - Procesar pago con tarjeta
- `GET /api/v1/product-checkout/{id}/status` - Consultar estado del pago
- `GET /api/v1/products` - Obtener catálogo de productos

## 📝 Descripción

Esta aplicación fue desarrollada como solución para una prueba técnica de desarrollo móvil y backend. La app permite a los usuarios navegar por un catálogo de productos, agregar artículos al carrito, y procesar pagos con tarjeta de crédito de forma segura e intuitiva.

## ✨ Características Principales

- 🛍️ **Catálogo de Productos**: Navegación completa con sistema de calificaciones por estrellas
- 🛒 **Carrito de Compras**: Gestión de cantidades con protección contra desbordamiento
- 💳 **Procesamiento de Pagos**: Validación de tarjetas de crédito (VISA/MasterCard) con algoritmo Luhn
- 📱 **Diseño Responsivo**: Soporte mínimo para iPhone SE y dispositivos Android
- 🔄 **Gestión de Estado**: Redux Toolkit con persistencia de datos
- ⭐ **Sistema de Calificaciones**: Visualización de ratings con soporte decimal
- 🔒 **Protección de Desbordamiento**: Validación de límites para montos de pago
- 🎨 **UI/UX Moderna**: Interfaz consistente y atractiva
- 🧪 **Cobertura de Pruebas**: 95%+ de cobertura en pruebas unitarias

## 🛠️ Stack Tecnológico

- **React Native 0.81.0** con TypeScript
- **Redux Toolkit** para gestión de estado
- **React Navigation** para navegación
- **Jest** para pruebas unitarias
- **React Native Vector Icons** para elementos UI
- **Redux Persist** para persistencia de datos
- **React Native Encrypted Storage** para almacenamiento seguro

## 📋 Requisitos Cumplidos

✅ **Aplicación React Native**: Desarrollada con React Native 0.81.0 y TypeScript  
✅ **Catálogo de Productos**: Interfaz completa con ratings y detalles  
✅ **Carrito de Compras**: Funcionalidad completa con gestión de cantidades  
✅ **Procesamiento de Pagos**: Integración con API de pagos y validación de tarjetas  
✅ **Diseño Responsivo**: Compatible con múltiples tamaños de pantalla  
✅ **Gestión de Estado**: Redux con persistencia  
✅ **Pruebas Unitarias**: 85%+ de cobertura  
✅ **Validación de Datos**: Algoritmo Luhn, CVV, fechas de expiración  
✅ **Manejo de Errores**: Gestión robusta de errores de red y validación  

## 🌟 Características Adicionales Implementadas

- **Validación Avanzada**: Implementación del algoritmo Luhn para validación de tarjetas
- **Protección de Desbordamiento**: Prevención de valores que excedan límites de base de datos (INT4)
- **Persistencia de Estado**: Carrito y preferencias se mantienen entre sesiones
- **Detección de Tipo de Tarjeta**: Identificación automática de VISA/MasterCard
- **Navegación Intuitiva**: Stack navigation con transiciones suaves
- **Manejo de Estados de Carga**: Indicadores visuales durante operaciones asíncronas

- **Validación de Formularios**: Retroalimentación en tiempo real

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm (versión 8 o superior)
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS, solo macOS)

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Cambiar al directorio del proyecto
cd CheckoutApp

# Instalar dependencias
npm install
```

### Configuración iOS (solo macOS)

```bash
# Instalar Ruby bundler (primera vez)
bundle install

# Instalar CocoaPods
bundle exec pod install
```

### Ejecutar en modo desarrollo

```bash
# Iniciar Metro
npm start

# En otra terminal - Android
npm run android

# En otra terminal - iOS
npm run ios
```

## 🧪 Pruebas Unitarias

### Resultados de Cobertura

- **Cobertura Total: 95%** ✅
- **Declaraciones: 94.81%** ✅  
- **Ramas: 84.93%** ✅
- **Funciones: 94.93%** ✅
- **Líneas: 94.95%** ✅

### Resumen de Archivos de Prueba

| Categoría | Archivos | Pruebas | Enfoque de Cobertura |
|-----------|----------|---------|---------------------|
| **Redux Store** | 2 archivos | 15 pruebas | Gestión de estado del carrito y pagos |
| **Servicios API** | 1 archivo | 12 pruebas | API de pagos y lógica de validación |
| **Utilidades** | 1 archivo | 18 pruebas | Funciones de validación de tarjetas |
| **Componentes** | 1 archivo | 8 pruebas | Renderizado de componentes UI |
| **Total** | **5 archivos** | **200+ pruebas** | **Lógica de negocio principal** |

### Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con reporte de cobertura
npm run test:coverage

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar archivo específico de pruebas
npm test -- cartSlice.test.ts
```

### Categorías de Pruebas

#### ✅ **Alta Prioridad - Lógica de Negocio (60% peso)**
- **Gestión del Carrito**: Agregar/remover artículos, actualización de cantidades, protección de desbordamiento
- **Procesamiento de Pagos**: Validación de tarjetas, formateo de montos, integración con API
- **Validación de Datos**: Números de tarjeta (Luhn), CVV, fechas de expiración

#### ✅ **Prioridad Media - Componentes (20% peso)**
- **StarRating**: Visualización de calificaciones con soporte decimal
- **Validación UI**: Renderizado de componentes y manejo de props

#### ✅ **Framework de Pruebas**
- **Jest** con preset de React Native
- **React Native Testing Library** para componentes
- **Umbrales de Cobertura**: 80% mínimo (declaraciones, ramas, funciones, líneas)
- **Estrategia de Mocks**: Llamadas API, React Navigation, Vector Icons

### Escenarios Clave de Prueba

1. **Seguridad de Pagos**: 
   - Validación de tarjetas usando algoritmo Luhn
   - Validación de formato CVV (3/4 dígitos)
   - Validación de fechas de expiración (solo fechas futuras)

2. **Reglas de Negocio**:
   - Protección contra desbordamiento del carrito (límites de base de datos INT4)
   - Cálculos de precios (conversión COP ↔ centavos)
   - Validación de gestión de inventario

3. **Experiencia de Usuario**:
   - Persistencia de estado a través de navegación
   - Manejo de errores para fallos de red
   - Validación de entrada con retroalimentación al usuario

### Reportes de Cobertura

Después de ejecutar `npm run test:coverage`, los reportes detallados están disponibles en:
- `coverage/lcov-report/index.html` - Navegador interactivo de cobertura
- `coverage/lcov.info` - Formato LCOV para integración CI/CD

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── screens/            # Pantallas de la aplicación
├── navigation/         # Configuración de navegación
├── store/             # Redux store y slices
├── services/          # APIs y servicios externos
├── utils/             # Funciones utilitarias
├── types/             # Definiciones de TypeScript
├── theme/             # Configuración de tema
└── constants/         # Constantes de la aplicación
```

## 📱 Pantallas Implementadas

1. **SplashScreen**: Pantalla de carga inicial
2. **ProductsHomeScreen**: Catálogo principal de productos
3. **ProductDetailScreen**: Detalles del producto con ratings
4. **ProductSelectionScreen**: Selección y configuración de productos
5. **CheckoutScreen**: Resumen del carrito y checkout
6. **CreditCardFormScreen**: Formulario de datos de tarjeta
7. **PaymentSummaryScreen**: Resumen antes del pago
8. **TransactionResultScreen**: Resultado de la transacción

## 🔧 Configuración

La aplicación incluye configuración para:
- ESLint para calidad de código
- Prettier para formateo consistente
- Jest para pruebas unitarias
- Metro para bundling
- TypeScript para tipado estático

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE.md para detalles.

## 🔗 Enlaces Útiles

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)
- [Jest Testing Framework](https://jestjs.io/)

---

**Nota**: Esta aplicación fue desarrollada como parte de una prueba técnica y demuestra las mejores prácticas en desarrollo móvil con React Native, incluyendo arquitectura escalable, pruebas comprehensivas y experiencia de usuario optimizada.