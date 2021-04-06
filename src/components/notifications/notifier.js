import { notification } from './store.js'

export function send(kind='info', title='Update', subtitle, caption='', timeout) {
  notification.set({ kind, title, subtitle, caption, timeout });
}

export function error(title, subtitle, caption, timeout) {
  send('error', title, subtitle, caption, timeout);
}

export function info(title, subtitle, caption, timeout) {
  send('info', title, subtitle, caption, timeout);
}

export function success(title, subtitle, caption, timeout) {
  send('success', title, subtitle, caption, timeout);
}

export function warning(title, subtitle, caption, timeout) {
  send('warning', title, subtitle, caption, timeout);
}