#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Setting up PiSignage with Next.js integration...\n');

try {
    // Install root dependencies
    console.log('📦 Installing root dependencies...');
    execSync('npm install', { stdio: 'inherit', cwd: __dirname });

    // Install frontend dependencies
    console.log('\n📦 Installing frontend dependencies...');
    execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, 'frontend') });

    // Build frontend for production
    console.log('\n🔨 Building frontend...');
    execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, 'frontend') });

    console.log('\n✅ Setup complete!');
    console.log('\nTo start the development server:');
    console.log('  npm run dev');
    console.log('\nTo start the production server:');
    console.log('  npm start');
    console.log('\nThe server will run on the port specified in your config file.');

} catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
}
