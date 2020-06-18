# Fantom PWA Explorer

JavaScript and Vue based Fantom pwa explorer.

We are using:
* Node / NPM
* ES2015 (and beyond) support.
* Vue.js
* Vue Router for routing
* Vuex for global state management
* SCSS

## Project setup

We use `npm` to handle dependencies.

```shell
npm install
```

### Hot Build

The `npm` script can be used to serve default implementation.

```shell
npm run serve
```

### Production Build

```shell
npm run build
```

## Localization

Translations for views and components are located in `src/locales` directory.

## Production notes

You should disable HTTP caching for file `dist/service-worker.js`.
