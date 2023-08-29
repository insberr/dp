/*import { precacheAndRoute, PrecacheEntry, addPlugins } from "workbox-precaching";*/
import { clientsClaim } from 'workbox-core';
import { version } from '@parcel/service-worker';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
//import { ExpirationPlugin }  from "workbox-expiration";
//import { request } from "http";
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

self.addEventListener('install', () => {
    self.skipWaiting().then(clientsClaim);
    console.log('oh shit guess who it fuckin is, its the gamer service worker here with offline support. (' + version + ')');
});

self.addEventListener('activate', () => {
    caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
            if (cacheName.split('$')[1] != version) {
                console.log('deleting old cache ' + cacheName);
                caches.delete(cacheName);
            }
        });
    });
});

self.addEventListener('push', async () => {
    // send notification
});

const toNetwork = ['document', 'manifest'];

const opt = {
    plugins: [new BackgroundSyncPlugin('syncy'), new CacheableResponsePlugin({ statuses: [0, 200] })],
    cacheName: 'schedulecache$' + version + '$',
};
registerRoute((r) => {
    if (toNetwork.includes(r.request.destination)) {
        return true;
    }
    const th = new URL(r.request.url);
    if (th.origin == location.origin && th.pathname == '/') {
        return true;
    }
    return false;
}, new NetworkFirst(opt));
registerRoute((r) => !toNetwork.includes(r.request.destination) && new URL(r.request.url).origin == location.origin, new CacheFirst(opt));
