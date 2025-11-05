const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSMTP() {
    console.log('Tes Koneksi SMTP\n');
    console.log('Konfigurasi SMTP:');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('Port: 465 (SSL)');
    console.log('User:', process.env.SMTP_USER);
    console.log('Pass:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'TIDAK ADA');

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        connectionTimeout: 15000,
        socketTimeout: 15000
    });

    try {
        console.log('\nMemverifikasi koneksi SMTP dengan SSL...');
        await transporter.verify();
        console.log('Koneksi SMTP berhasil diverifikasi!');

        console.log('\nMengirim email test...');
        const info = await transporter.sendMail({
            from: `"Chill Movie Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: 'Tes Email - Chill Movie API',
            html: `
                <h2>Tes Email Berhasil</h2>
                <p>Email ini mengkonfirmasi bahwa integrasi SMTP bekerja dengan baik.</p>
                <p><strong>Waktu:</strong> ${new Date().toISOString()}</p>
                <p><strong>Dari:</strong> Chill Movie Backend</p>
                <hr>
                <small>Koneksi SSL berhasil</small>
            `
        });

        console.log('Email test berhasil dikirim!');
        console.log('ID Pesan:', info.messageId);
        console.log('Email akan muncul di:', process.env.SMTP_USER);

        return true;
    } catch (error) {
        console.log('Error SMTP:', error.message);

        if (error.code === 'EAUTH') {
            console.log('\nKemungkinan solusi:');
            console.log('1. Cek apakah App Password sudah benar');
            console.log('2. Pastikan 2-Factor Authentication sudah aktif');
            console.log('3. Verifikasi akun Gmail:', process.env.SMTP_USER);
        } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
            console.log('\nMasalah koneksi/timeout:');
            console.log('1. Cek koneksi internet');
            console.log('2. Verifikasi SMTP host dan port');
            console.log('3. Firewall perusahaan mungkin memblokir port 587');
            console.log('4. Coba gunakan port 465 dengan secure: true');
            console.log('5. ISP mungkin memblokir port SMTP');
        }

        return false;
    }
}

testSMTP()
    .then(success => {
        if (success) {
            console.log('\nTES SMTP DENGAN SSL BERHASIL');
            console.log('Cek inbox di:', process.env.SMTP_USER);
            console.log('\nGunakan konfigurasi ini untuk production:');
            console.log('Port: 465, secure: true');
        } else {
            console.log('\nTES SMTP DENGAN SSL GAGAL');
            console.log('Integrasi email tidak akan bekerja sampai masalah network/firewall diselesaikan.');
        }
    })
    .catch(console.error);