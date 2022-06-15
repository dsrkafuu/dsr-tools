import './styles/index.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';
import router from './router';
import App from './App.vue';

const app = createApp(App);

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
if (SENTRY_DSN) {
  Sentry.init({
    app,
    dsn: SENTRY_DSN,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
    ],
    sampleRate: 1, // report all errors
    tracesSampleRate: 0.05, // report 5% of traces
  });
}

const pinia = createPinia();

app.use(pinia).use(router).mount('#app');
