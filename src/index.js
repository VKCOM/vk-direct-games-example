import "regenerator-runtime/runtime.js";
import './css/style.css'
import vkDirectGameApp from './vkDirectGameApp';
import bridge from "@vkontakte/vk-bridge";

window.vkDirectGameApp = new vkDirectGameApp();
window.vkDirectGameApp.init();
window.bridge = bridge;
