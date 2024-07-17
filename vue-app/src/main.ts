import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Biding from './modules/Biding.ts';

let _bid = new Biding();

createApp(App).mount('#app')
