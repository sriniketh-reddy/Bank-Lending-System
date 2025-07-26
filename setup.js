const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Bank Lending System...\n');

// Check if Node.js is installed
try {
  execSync('node --version', { stdio: 'pipe' });
  console.log('✅ Node.js is installed');
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Setup Backend
console.log('\n📦 Setting up Backend...');
try {
  process.chdir('backend');
  
  console.log('Installing backend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Initializing database...');
  execSync('npm run init-db', { stdio: 'inherit' });
  
  console.log('✅ Backend setup completed');
} catch (error) {
  console.error('❌ Backend setup failed:', error.message);
  process.exit(1);
}

// Setup Frontend
console.log('\n📦 Setting up Frontend...');
try {
  process.chdir('../frontend');
  
  console.log('Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('✅ Frontend setup completed');
} catch (error) {
  console.error('❌ Frontend setup failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Start the backend server: cd backend && npm start');
console.log('2. Start the frontend server: cd frontend && npm start');
console.log('3. Open http://localhost:3000 in your browser');
console.log('\n💡 The backend will run on http://localhost:3001');
console.log('💡 The frontend will run on http://localhost:3000'); 