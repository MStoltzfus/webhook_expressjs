import { copyFileSync, constants } from 'node:fs';

// copy static files from dev ./public to ./dist/public for easy use with auto-deploy pipelines on host services

copyFileSync('./public/index.html', './dist/public/index.html');
console.log('index.html was copied to ./dist/public');

copyFileSync('./public/socketChatClient.html', './dist/public/socketChatClient.html');
console.log('socketChatClient.html was copied to ./dist/public');

copyFileSync('./public/style.css', './dist/public/style.css');
console.log('style.css was copied to ./dist/public');
