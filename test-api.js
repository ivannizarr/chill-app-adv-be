const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// GANTI DATA INI SEBELUM TESTING
const testUser = {
    fullname: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test123'
};

const testMovie = {
    title: 'Test Movie',
    description: 'This is a test movie',
    release_year: 2024,
    duration_min: 120,
    rating: 8.5,
    language: 'English'
};

let authToken = '';

async function makeRequest(method, url, data = null, token = null) {
    try {
        const config = {
            method,
            url: `${BASE_URL}${url}`,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            },
            ...(data && { data })
        };

        const response = await axios(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || error.message,
            status: error.response?.status || 500
        };
    }
}

async function runTests() {
    console.log('TES API CHILL MOVIE\n');
    console.log('==========================================');

    // Test API Info
    console.log('\nTes 1: Informasi API Dasar');
    const apiInfo = await makeRequest('GET', '/');
    console.log(apiInfo.success ? 'BERHASIL - Informasi API berhasil dimuat' : 'GAGAL - Informasi API gagal dimuat');
    if (apiInfo.success) {
        console.log(`   Versi: ${apiInfo.data.version}`);
    }

    // Test Movies endpoint
    console.log('\nTes 2: Endpoint Movies');
    const movies = await makeRequest('GET', '/api/movies');
    console.log(movies.success ? 'BERHASIL - Endpoint movies dapat diakses' : 'GAGAL - Endpoint movies tidak dapat diakses');
    if (!movies.success) {
        console.log(`   Error: ${movies.error.message || movies.error}`);
        console.log('   Hal ini wajar jika database belum terkoneksi');
    }

    // Test Register User
    console.log('\nTes 3: Registrasi User');
    const register = await makeRequest('POST', '/api/auth/register', testUser);
    console.log(register.success ? 'BERHASIL - Registrasi user berhasil' : 'GAGAL - Registrasi user gagal');
    if (register.success) {
        authToken = register.data.data.token;
        console.log(`   User ID: ${register.data.data.user.id}`);
        console.log(`   Token diterima: ${authToken.substring(0, 20)}...`);
    } else {
        console.log(`   Error: ${register.error.message || JSON.stringify(register.error)}`);
        if (register.error.errors) {
            console.log(`   Validation errors: ${JSON.stringify(register.error.errors, null, 2)}`);
        }
    }

    // Test Login User
    if (!authToken) {
        console.log('\nTes 4: Login User (alternatif)');
        const login = await makeRequest('POST', '/api/auth/login', {
            email: testUser.email,
            password: testUser.password
        });
        console.log(login.success ? 'BERHASIL - Login user berhasil' : 'GAGAL - Login user gagal');
        if (login.success) {
            authToken = login.data.data.token;
            console.log(`   Token diterima: ${authToken.substring(0, 20)}...`);
        }
    }

    // Test Profile Access
    if (authToken) {
        console.log('\nTes 5: Akses Profil (Route Terproteksi)');
        const profile = await makeRequest('GET', '/api/auth/profile', null, authToken);
        console.log(profile.success ? 'BERHASIL - Akses profil berhasil' : 'GAGAL - Akses profil gagal');
        if (profile.success) {
            console.log(`   Nama: ${profile.data.data.fullname || profile.data.data.name}`);
            console.log(`   Email: ${profile.data.data.email}`);
        }
    }

    // Test Create Movie (Admin)
    if (authToken) {
        console.log('\nTes 6: Buat Movie (membutuhkan role admin)');
        const createMovie = await makeRequest('POST', '/api/movie', testMovie, authToken);
        console.log(createMovie.success ? 'BERHASIL - Pembuatan movie berhasil' : 'GAGAL - Pembuatan movie gagal');
        if (!createMovie.success) {
            console.log(`   Error: ${createMovie.error.message || createMovie.error}`);
            console.log('   Hal ini wajar untuk user non-admin');
        }
    }

    // Test Movies with Search/Filter
    console.log('\nTes 7: Movies dengan Search/Filter');
    const searchMovies = await makeRequest('GET', '/api/movies?search=test&sort=title&order=ASC&limit=5', null, authToken);
    console.log(searchMovies.success ? 'BERHASIL - Pencarian/filter movie berfungsi' : 'GAGAL - Pencarian/filter movie tidak berfungsi');
    if (!searchMovies.success) {
        console.log(`   Error: ${searchMovies.error.message || JSON.stringify(searchMovies.error)}`);
    }

    // Test File Upload Test
    console.log('\nTes 8: Pengecekan Endpoint Upload');
    const uploadTest = await makeRequest('POST', '/api/upload/upload', {}, authToken);
    if (uploadTest.success === false && uploadTest.error.message === 'File tidak ditemukan') {
        console.log('BERHASIL - Upload endpoint berfungsi (error validation benar)');
        console.log('   Endpoint upload sudah dikonfigurasi dan dapat diakses');
    } else {
        console.log('GAGAL - Upload endpoint tidak merespon dengan benar');
    }

    console.log('\n==========================================');
    console.log('TES API SELESAI');
    console.log('\nLangkah Selanjutnya:');
    console.log('1. Pastikan database MySQL berjalan dan dapat diakses');
    console.log('2. Buat skema database menggunakan PhpMyAdmin (http://localhost:8080)');
    console.log('3. Tes upload file dengan file asli menggunakan Postman');
    console.log('4. Buat user admin untuk manajemen movie');
}

runTests().catch(console.error);