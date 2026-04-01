require('dotenv').config({ path: '.env.test' });
require('@testing-library/jest-dom');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';

if (typeof global.TextEncoder === 'undefined') {
	const { TextEncoder } = require('util');
	global.TextEncoder = TextEncoder;
}
