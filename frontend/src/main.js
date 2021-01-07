import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

// URL.prototype.get_url = function () {
//     return this.pathname + this.search
// };
//
// String.prototype.get_url = function () {
//     const url = new URL(this);
//     return url.pathname + url.search
// };
//


createApp(App).use(router).mount('#app');
