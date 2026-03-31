// Carrega variáveis do .env.test antes de tudo
require('dotenv').config({ path: '.env.test' });
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
global.ReadableStream = require('web-streams-polyfill').ReadableStream;
global.MessagePort = require('worker_threads').MessagePort;
global.Response = require('undici').Response;
require('@testing-library/jest-dom');
// Garante JWT_SECRET para testes de API
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
if (typeof global.TextEncoder === 'undefined') {
	const { TextEncoder } = require('util');
	global.TextEncoder = TextEncoder;
}
