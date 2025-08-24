# Payment Checkout App - Requerimientos y Plan de Acción

## Resumen del Proyecto
Desarrollo de una aplicación móvil React Native + Backend NestJS para procesamiento de pagos con tarjeta de crédito, integrada con la API de Wompi.

## Requerimientos Técnicos Mandatorios

### Frontend Mobile (React Native)
- **Framework**: React Native (última versión estable) con TypeScript
- **Arquitectura**: Redux obligatorio siguiendo arquitectura Flux
- **Responsive**: Soportar múltiples tamaños de pantalla (mínimo iPhone SE 2020: 1334x750px)
- **Almacenamiento**: Datos de transacción encriptados en estado/localStorage
- **Testing**: Pruebas unitarias con Jest (>80% cobertura)
- **Build**: Generar .apk (Android) y/o .ipa (iOS opcional)

### Backend API (NestJS)
- **Framework**: NestJS + TypeScript (última versión estable)
- **Funcionalidades**: 
  - Crear transacciones en estado PENDING
  - Integración con Wompi Payment API
  - Gestión de productos y stock
  - Actualización de transacciones
- **Testing**: Pruebas unitarias con Jest (>80% cobertura)
- **Deploy**: Opcional en Cloud (AWS recomendado) o Dockerfile

## Flujo de 7 Pantallas Obligatorias

### 1. Splash Screen
- Pantalla de bienvenida/carga
- Diseño libre

### 2. Home de Productos
- Lista de productos con información y precios
- UI para mostrar productos de la tienda

### 3. Selección de Producto
- Permitir seleccionar 1 o N productos
- Agregar items al carrito

### 4. Checkout
- Mostrar botón "Pay with credit card"
- Abrir Backdrop con formulario de tarjeta

### 5. Información de Tarjeta de Crédito
- Formulario para datos de tarjeta
- Validación de datos
- Detección de logos MasterCard/VISA (plus)
- Datos fake pero con estructura real de tarjetas

### 6. Resumen de Pago
- Mostrar resumen en backdrop component
- Botón de pago
- Llamada a backend API
- Manejo de happy/unhappy paths
- Toast de error en caso de fallo

### 7. Estado Final de Transacción
- Mostrar resultado de la transacción
- Regresar a Home de Productos

## Integración Wompi API (Sandbox)

### URLs y Credenciales
- **Sandbox URL**: `https://api-sandbox.co.uat.wompi.dev/v1`
- **Public Key**: `pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7`
- **Private Key**: `prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg`
- **Events Key**: `stagtest_events_2PDUmhMywUkvb1LvxYnayFbmofT7w39N`
- **Integrity Key**: `stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp`

### Documentación Requerida
- https://docs.wompi.co/docs/colombia/inicio-rapido/
- https://docs.wompi.co/docs/colombia/ambientes-y-llaves/

## Plan de Acción Detallado

### Fase 1: Configuración Base
1. **Inicializar proyecto React Native con TypeScript**
   - Configurar estructura de carpetas
   - Configurar ESLint/Prettier
   - Configurar paths absolutos

2. **Configurar Redux Store**
   - Instalar Redux Toolkit
   - Configurar store con slices para:
     - Products
     - Cart
     - Transactions
     - User/Payment data
   - Implementar persistencia encriptada

3. **Configurar Navegación**
   - React Navigation v6
   - Stack Navigator para las 7 pantallas
   - Configurar tipos TypeScript

### Fase 2: UI/UX y Pantallas
1. **Crear componentes base**
   - Button, Input, Card, Modal/Backdrop
   - Tema y estilos consistentes
   - Componente de detección de tarjetas

2. **Implementar las 7 pantallas**
   - SplashScreen
   - ProductsHome
   - ProductSelection
   - Checkout
   - CreditCardForm
   - PaymentSummary
   - TransactionResult

3. **Validaciones de formularios**
   - Validación de tarjetas de crédito
   - Formik/React Hook Form
   - Mensajes de error

### Fase 3: Backend NestJS
1. **Configurar proyecto NestJS**
   - Inicializar con TypeScript
   - Configurar base de datos (SQLite/PostgreSQL)
   - Configurar variables de entorno

2. **Implementar módulos**
   - Products Module (CRUD)
   - Transactions Module
   - Payments Module (integración Wompi)
   - Auth Module (opcional)

3. **Integración Wompi**
   - Service para llamadas a Wompi API
   - Manejo de webhooks
   - Validación de integridad

### Fase 4: Integración y Testing
1. **Conectar Frontend con Backend**
   - Configurar API client (Axios)
   - Manejo de estados de carga
   - Error handling

2. **Implementar Testing**
   - Unit tests componentes React Native
   - Unit tests servicios NestJS
   - Mocks de API Wompi
   - Alcanzar >80% cobertura

### Fase 5: Build y Deploy
1. **Generar builds móvil**
   - Configurar signing Android
   - Generar .apk
   - Opcional: .ipa para iOS

2. **Deploy Backend (Opcional)**
   - Dockerfile
   - Deploy en AWS/Heroku/Railway

## Criterios de Evaluación
- **[5 pts]** README completo, imágenes optimizadas, sin crashes
- **[35 pts]** App móvil con flujo completo de checkout
- **[30 pts]** Backend API funcionando correctamente
- **[30 pts]** Unit tests y cobertura
- **[15 pts bonus]** Habilidades CSS
- **[20 pts bonus]** Clean code/Arquitectura Hexagonal
- **[25 pts bonus]** Backend desplegado en Cloud

**Mínimo requerido: 100 puntos**

## Consideraciones Importantes
- ✅ Crear branches y PRs por feature
- ⚠️ README completo con instrucciones
- ⚠️ Repositorio público en GitHub
- ⚠️ NO usar "Wompi" en nombres de repositorio
- ⚠️ App resiliente, sin crashes, guardar estado
- ⚠️ Solo modo Sandbox, NO transacciones reales

## Stack Tecnológico Final
- **Frontend**: React Native + TypeScript + Redux + React Navigation
- **Backend**: NestJS + TypeScript + Database (SQLite/PostgreSQL)
- **Testing**: Jest + Coverage >80%
- **Integration**: Wompi Sandbox API
- **Tools**: ESLint, Prettier, Flipper (debug)