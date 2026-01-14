import CAPI from './src/capi.js';

//const api = new CAPI('https://api.example.com');

// Initialize API client
const api = new CAPI('http://localhost:3000');

// Helper function to add delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to log test results
const logTest = (testName, result) => {
  console.log(`\n✅ ${testName}`);
  console.log('Response:', JSON.stringify(result, null, 2));
};

// Main test function
async function runTests() {
  console.log('🚀 Starting CAPI Tests...\n');

  try {
    // Test 1: Health Check (GET)
    const health = await api.get('/health?a=b&c=b');
    logTest('GET /health', health);
    await delay(500);

    // Test 2: Get all users (READ alias)
    const allUsers = await api.get('/users');
    logTest('READ /users (GET alias)', allUsers);
    await delay(500);

    // Test 3: Create new user (CREATE alias)
    const newUser = await api.create('/users', {
      name: 'Charlie Brown',
      email: 'charlie@example.com'
    });

    logTest('CREATE /users (POST alias)', newUser);
    const userId = newUser.data.id;
    await delay(500);

    // Test 4: Get single user (FETCH alias)
    const singleUser = await api.fetch(`/users/${userId}`);
    logTest(`FETCH /users/${userId} (GET alias)`, singleUser);
    await delay(500);

    // Test 5: Update user partially (UPDATE alias)
    const updatedUser = await api.update(`/users/${userId}`, {
      name: 'Charles Brown'
    });
    logTest(`UPDATE /users/${userId} (PATCH alias)`, updatedUser);
    await delay(500);

    // Test 6: Replace user completely (REPLACE alias)
    const replacedUser = await api.replace(`/users/${userId}`, {
      name: 'Chuck Brown',
      email: 'chuck@example.com'
    });
    logTest(`REPLACE /users/${userId} (PUT alias)`, replacedUser);
    await delay(500);

    // Test 7: Using original HTTP method names
    const postUser = await api.post('/users', {
      name: 'Dave Wilson',
      email: 'dave@example.com'
    });
    logTest('POST /users (original method)', postUser);
    await delay(500);
    const patchUser = await api.patch(`/users/${postUser.data.id}`, {
      email: 'david@example.com'
    });
    logTest(`PATCH /users/${postUser.data.id} (original method)`, patchUser);
    await delay(500);

    // Test 8: Delete user (REMOVE alias)
    const removedUser = await api.remove(`/users/${userId}`);
    logTest(`REMOVE /users/${userId} (DELETE alias)`, removedUser);
    await delay(500);

    // Test 9: Get all users after deletions
    const finalUsers = await api.get('/users');
    logTest('GET /users (final state)', finalUsers);
    console.log('\n✅ All tests completed successfully! 🎉\n');
  } 
  catch (error) {
    console.error('\n❌ Test failed:');
    console.error('Message:', error.message);

    if (error.status)
      console.error('Status:', error.status);

    if (error.data)
      console.error('Data:', error.data);
  }
}

// Test error handling
async function testErrorHandling() {
  console.log('\n🧪 Testing Error Handling...\n');
  
  try {
    // Test 404 error
    await api.get('/users/9999');
  } 
  catch (error) {
    console.log('✅ 404 Error caught correctly:');
    console.log('Status:', error.status);
    console.log('Message:', error.message);
  }

  try {
    // Test validation error
    await api.post('/users', { name: 'No Email' });
  } 
  catch (error) {
    console.log('\n✅ Validation Error caught correctly:');
    console.log('Status:', error.status);
    console.log('Data:', error.data);
  }
  console.log('\n✅ Error handling tests completed! 🎉\n');
}

// Run all tests
(async () => {
  await runTests();
  await delay(1000);
  await testErrorHandling();
})();
