import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, FileText, Download, Lock, UserCheck, LogIn, LogOut, UserPlus, Key, Trash2 } from 'lucide-react';

// Fungsi untuk membuat URL Google Maps dari koordinat
const createMapLink = (lat, lng) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

const AttendanceSystem = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [attendances, setAttendances] = useState([]);
    const [view, setView] = useState('employee');
    const [serverPassword, setServerPassword] = useState('');
    const [isServerAuth, setIsServerAuth] = useState(false);
    const [serverType, setServerType] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [formData, setFormData] = useState({ name: '', purpose: '', customTime: '' });
    const [location, setLocation] = useState(null); // { lat, lng }
    const [filterDate, setFilterDate] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    // Default mode diubah ke 'keluar' agar sesuai dengan posisi tombol baru di kiri
    const [attendanceMode, setAttendanceMode] = useState('keluar'); 
    
    // Daftar karyawan (diambil dari data sebelumnya)
    const [employeeList, setEmployeeList] = useState([
        'AGUNG TRI WARDANI', 'AHMAD SYAIFUL', 'AJI KURNIA RAMADHAN', 'ANAS FAUZI', 'ANAZYAH ZUROH', 'ANDI R FASHA JUANDI', 'ANTORO', 'ARI PURNOMO', 'ARIE SUPRIYANTO', 'ARIEF SUPRIYONO', 'ARIF WAHYUDI', 'ASA FATHIKHLAASH', 'AYI', 'AYOM WAHYU N', 'DESI APRILIENI', 'DEWI SARTIKA', 'DIMAS AR RASYID', 'DODY APRIYANA', 'ENDAY', 'GUSTAMININGSIH', 'HADI', 'HADI PURNOMO', 'HASANUDIN', 'HAYADI', 'HENDIYANA', 'INDRI SUSANTI', 'INRA EFFENDI ASRI', 'IRMA HARTINI', 'JOKO SUKENDRO', 'KHAIRUDDIN', 'LILI TOLANI', 'M ZAINAL RIZKI', 'MAMIK WIYANTO', 'MUHAMAD ALFAZRI', 'MUHAMMAD ALFINAS', 'MUHLISIN', 'NOPI HARYANTI', 'PRIYANTO', 'REVAN SAPUTRA', 'RUKMAN HAKIM', 'SAEPUDIN', 'SAHRONI', 'SANDI ALJABAR', 'SONY DARMAWAN', 'SUANDA', 'SUKASAH', 'SUPRIYANTO', 'SUWARNO', 'SUYARTO', 'TARMAN', 'TARJONO', 'TOYA SAMODRA', 'ULUT SURYANA', 'UYUM JUMHANA', 'WACA WIJAYA', 'WAHYUDIN', 'WAODE INDAH FARIDA', 'WARMIN', 'YAYAN HARYANTO', 'YATNO WIDIYATNO'
    ].sort());
    
    // Passwords untuk Admin dan PKD
    const [passwords, setPasswords] = useState({ admin: 'admin123', pkd: 'pkd123' });
    
    // State UI untuk Pengaturan
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [passwordUserToChange, setPasswordUserToChange] = useState('admin'); // 'admin' atau 'pkd'
    const [showAddEmployee, setShowAddEmployee] = useState(false);
    const [newEmployeeName, setNewEmployeeName] = useState('');

    // State UI untuk Riwayat
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState(null);

    // --- EFFECT HOOKS ---
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                },
                () => {
                    // Jika gagal atau ditolak, set lokasi ke koordinat default (contoh: Monas, Jakarta)
                    setLocation({ lat: -6.1751, lng: 106.8650, failed: true });
                }
            );
        } else {
             setLocation({ lat: -6.1751, lng: 106.8650, failed: true });
        }
    }, []);

    // --- FUNGSI AUTH & PENGATURAN ---

    const handleServerLogin = () => {
        if (serverPassword === passwords.admin) {
            setIsServerAuth(true);
            setServerType('admin');
            setView('server');
            setActiveTab('dashboard');
        } else if (serverPassword === passwords.pkd) {
            setIsServerAuth(true);
            setServerType('pkd');
            setView('server');
            setActiveTab('riwayat');
        } else {
            alert('PASSWORD SALAH!');
        }
    };

    const handlePasswordChange = () => {
        if (!newPassword || newPassword.length < 6) {
            alert('PASSWORD BARU HARUS MINIMAL 6 KARAKTER!');
            return;
        }
        setPasswords({ ...passwords, [passwordUserToChange]: newPassword });
        setNewPassword('');
        setShowPasswordChange(false);
        alert(`PASSWORD ${passwordUserToChange.toUpperCase()} BERHASIL DIUBAH!`);
    };

    const handleAddEmployee = () => {
        if (!newEmployeeName.trim()) {
            alert('NAMA KARYAWAN HARUS DIISI!');
            return;
        }
        const upperName = newEmployeeName.toUpperCase().trim();
        if (employeeList.includes(upperName)) {
            alert('NAMA SUDAH ADA DALAM DAFTAR!');
            return;
        }
        setEmployeeList([...employeeList, upperName].sort());
        setNewEmployeeName('');
        setShowAddEmployee(false);
        alert('KARYAWAN BERHASIL DITAMBAHKAN!');
    };

    const handleRemoveEmployee = (nameToRemove) => {
        if (window.confirm(`YAKIN INGIN MENGHAPUS KARYAWAN ${nameToRemove} DARI DAFTAR?`)) {
            setEmployeeList(employeeList.filter(name => name !== nameToRemove));
            alert(`${nameToRemove} BERHASIL DIHAPUS.`);
        }
    };

    // --- FUNGSI ABSENSI ---

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const createAttendanceRecord = (employeeName, type, customTime, purpose = '-') => {
        if (!photo) {
            alert('FOTO WAJIB DIAMBIL TERLEBIH DAHULU!');
            return false;
        }

        if (!location) {
             alert('LOKASI GPS BELUM TERDETEKSI. COBA LAGI.');
             return false;
        }
        
        const newAttendance = {
            id: Date.now(),
            name: employeeName,
            position: 'ANGGOTA',
            type: type,
            customTime: customTime,
            purpose: purpose,
            date: currentTime.toLocaleDateString('id-ID'),
            timestamp: currentTime.toLocaleTimeString('id-ID'),
            // Simpan koordinat mentah untuk tautan Maps
            location: location.failed ? 'LOKASI TIDAK TERSEDIA' : `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`, 
            photo: photoPreview,
            fullTimestamp: currentTime.toISOString()
        };

        setAttendances([newAttendance, ...attendances]);
        setFormData({ name: '', purpose: '', customTime: '' });
        setPhoto(null);
        setPhotoPreview(null);
        return true;
    };

    const handleQuickAttendance = (employeeName) => {
        const currentTimeStr = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        if (createAttendanceRecord(employeeName, 'masuk', currentTimeStr)) {
            alert(`✅ ${employeeName} BERHASIL ABSEN MASUK!`);
        }
    };

    const handleSubmitKeluar = () => {
        if (!formData.name || !formData.customTime || !formData.purpose) {
            alert('SEMUA KOLOM WAJIB DIISI!');
            return;
        }
        if (createAttendanceRecord(formData.name, 'keluar', formData.customTime, formData.purpose)) {
             alert('✅ ABSENSI KELUAR BERHASIL DICATAT!');
        }
    };

    // --- DATA & STATISTIK ---
    const filteredAttendances = filterDate ? 
        attendances.filter(a => a.date === new Date(filterDate).toLocaleDateString('id-ID')) : 
        attendances;

    const stats = {
        total: attendances.length,
        keluar: attendances.filter(a => a.type === 'keluar').length,
        masuk: attendances.filter(a => a.type === 'masuk').length,
        unique: employeeList.length 
    };

    const exportToCSV = () => {
        const headers = ['TANGGAL', 'WAKTU INPUT', 'NAMA', 'TIPE', 'WAKTU', 'KEPERLUAN', 'LOKASI (Lat, Lng)'];
        const rows = filteredAttendances.map(a => [a.date, a.timestamp, a.name, a.type.toUpperCase(), a.customTime, a.purpose || '-', a.location.replace(/,/g, '')] );
        const csv = [headers, ...rows].map(row => row.join(';')).join('\n'); // Menggunakan titik koma (;) sebagai delimiter
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ABSENSI-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    // --- KOMPONEN BANTUAN UI ---

    const LocationDisplay = ({ locationData }) => {
        if (locationData && locationData.includes(',')) {
            const [lat, lng] = locationData.split(',').map(c => c.trim());
            return (
                <a 
                    href={createMapLink(lat, lng)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-xs font-medium"
                >
                    <MapPin className="w-4 h-4 mr-1"/>
                    Lihat di Peta
                </a>
            );
        }
        return <span className="text-gray-500 text-xs">{locationData}</span>;
    };

    const PhotoModal = ({ photoUrl, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-700 hover:text-red-500">
                        <XCircle className="w-6 h-6"/>
                    </button>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">FOTO ABSENSI</h3>
                <img src={photoUrl} alt="Foto Absensi Karyawan" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
        </div>
    );
    
    // --- RENDER UTAMA ---

    // Tampilan 1: Login Server atau Pegawai
    if (view === 'employee' || !isServerAuth) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 font-sans">
                <div className="max-w-2xl mx-auto">
                    {/* Header Utama - PERUBAHAN JUDUL */}
                    <div className="bg-white rounded-xl shadow-2xl p-6 mb-6 border-b-4 border-indigo-600">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-900 mb-1 leading-tight">ABSENSI IZIN KELUAR MASUK PPNPN</h1>
                                <p className="text-xs text-gray-500 font-semibold">MITRA KPU BEA DAN CUKAI TANJUNG PRIOK TIPE A</p>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-600 text-sm mt-3">
                                    <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
                                        <Calendar className="w-4 h-4 text-indigo-600" />
                                        <span>{currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
                                        <Clock className="w-4 h-4 text-indigo-600" />
                                        <span className="font-mono text-lg font-bold">{currentTime.toLocaleTimeString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => { setView('server'); setIsServerAuth(false); }} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md text-sm" >
                                <Lock className="w-4 h-4" /> <span className="hidden sm:inline">SERVER</span>
                            </button>
                        </div>
                    </div>

                    {/* Login Server (Tidak Berubah) */}
                    {view === 'server' && !isServerAuth ? (
                        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Lock className="w-6 h-6 text-indigo-600"/> LOGIN SERVER</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">PASSWORD</label>
                                    <input 
                                        type="password" 
                                        value={serverPassword} 
                                        onChange={(e) => setServerPassword(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleServerLogin()}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase shadow-sm" 
                                        placeholder="MASUKKAN PASSWORD SERVER" 
                                    />
                                </div>
                                <button onClick={handleServerLogin} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200" >
                                    <LogIn className="w-5 h-5 inline mr-2"/> LOGIN
                                </button>
                                <button onClick={() => setView('employee')} className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors" > 
                                    KEMBALI KE ABSENSI
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Tampilan Absensi Pegawai */
                        <div className="space-y-6">
                            
                            {/* Mode Switch & Lokasi */}
                            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
                                <div className="flex gap-3 w-full md:w-auto">
                                    {/* POSISI DITUKAR: KELUAR (KIRI) */}
                                    <button 
                                        onClick={() => setAttendanceMode('keluar')} 
                                        className={`flex-1 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                                            attendanceMode === 'keluar' ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
                                        }`}
                                    >
                                        <LogOut className="w-5 h-5" /> ABSENSI KELUAR 
                                    </button>
                                    {/* POSISI DITUKAR: MASUK (KANAN) */}
                                    <button 
                                        onClick={() => setAttendanceMode('masuk')} 
                                        className={`flex-1 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                                            attendanceMode === 'masuk' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                                        }`}
                                    > 
                                        <LogIn className="w-5 h-5" /> ABSEN MASUK
                                    </button>
                                </div>
                                <div className="text-center md:text-right w-full md:w-auto">
                                    <p className="text-xs text-gray-500">LOKASI GPS:</p>
                                    <div className="flex items-center justify-center md:justify-end">
                                        {location ? (
                                            <a 
                                                href={createMapLink(location.lat, location.lng)} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className={`flex items-center gap-1 text-sm font-medium ${location.failed ? 'text-red-500' : 'text-blue-600 hover:text-blue-700'}`}
                                            >
                                                <MapPin className="w-4 h-4" /> 
                                                {location.failed ? 'LOKASI TIDAK DITEMUKAN' : 'Lokasi Terdeteksi'}
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-4 h-4 animate-pulse"/>Memuat...</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Absensi Keluar Mode (Dipindahkan ke Tampilan Pertama) */}
                            {attendanceMode === 'keluar' ? (
                                <div className="bg-white rounded-xl shadow-2xl p-6 border-t-4 border-orange-600">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">ABSENSI KELUAR 🟠</h2>
                                    <p className="text-orange-600 text-sm font-bold mb-6">* SEMUA KOLOM WAJIB DIISI</p>
                                    <div className="space-y-4">
                                        {/* Nama */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">NAMA KARYAWAN *</label>
                                            <select 
                                                value={formData.name} 
                                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase shadow-sm"
                                            >
                                                <option value="">PILIH NAMA</option>
                                                {employeeList.map((name) => (
                                                    <option key={name} value={name}>{name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Waktu */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">WAKTU KELUAR *</label>
                                            <input 
                                                type="time" 
                                                value={formData.customTime} 
                                                onChange={(e) => setFormData({...formData, customTime: e.target.value})} 
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm" 
                                            />
                                        </div>
                                        {/* Keperluan */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">KEPERLUAN *</label>
                                            <textarea 
                                                value={formData.purpose} 
                                                onChange={(e) => setFormData({...formData, purpose: e.target.value})} 
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase shadow-sm" 
                                                placeholder="ISI KEPERLUAN KELUAR KANTOR (Contoh: DINAS LUAR)" rows="3" 
                                            />
                                        </div>
                                        {/* Foto */}
                                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><UserCheck className="w-4 h-4 mr-1 text-orange-600"/> FOTO WAJIB *</label>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                capture="user" 
                                                onChange={handlePhotoChange} 
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200"
                                            />
                                            {photoPreview && (
                                                <div className="mt-4 relative">
                                                    <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border-2 border-orange-500 shadow-md" />
                                                    <span className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">PREVIEW FOTO</span>
                                                </div>
                                            )}
                                        </div>

                                        <button onClick={handleSubmitKeluar} className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200" > 
                                            <LogOut className="w-5 h-5" /> CATAT ABSENSI KELUAR
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                {/* Absen Masuk Mode (Dipindahkan ke Tampilan Kedua) */}
                                <div className="bg-white rounded-xl shadow-2xl p-6 border-t-4 border-green-600">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">ABSEN MASUK 🟢</h2>
                                    <p className="text-gray-600 text-sm mb-6">Ambil foto selfie jelas, lalu tekan nama Anda.</p>

                                    {/* Foto */}
                                    <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center"><UserCheck className="w-4 h-4 mr-1 text-green-600"/> FOTO WAJIB *</label>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            capture="user" 
                                            onChange={handlePhotoChange} 
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                                        />
                                        {photoPreview && (
                                            <div className="mt-4 relative">
                                                <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border-2 border-green-500 shadow-md" />
                                                <span className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">PREVIEW FOTO</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Employee List */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3">PILIH NAMA ANDA (TEKAN UNTUK ABSEN) *</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                                            {employeeList.map((name) => (
                                                <button 
                                                    key={name} 
                                                    onClick={() => handleQuickAttendance(name)} 
                                                    className="w-full text-left px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg hover:from-green-100 hover:border-green-400 transition-all font-medium text-gray-800 flex items-center justify-between group shadow-sm text-sm"
                                                >
                                                    <span>{name}</span>
                                                    <CheckCircle className="w-5 h-5 text-green-600 opacity-70 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Tampilan 2: Server (Admin & PKD) - Tidak ada perubahan judul
    return (
        <div className="min-h-screen bg-gray-50 p-4 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header Server */}
                <div className="bg-white rounded-xl shadow-2xl p-6 mb-6 border-b-4 border-indigo-600">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-900 mb-2">DASHBOARD SERVER {serverType.toUpperCase()}</h1>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-600 text-sm">
                                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
                                    <Calendar className="w-4 h-4 text-indigo-600" />
                                    <span>{currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
                                    <Clock className="w-4 h-4 text-indigo-600" />
                                    <span className="font-mono text-lg font-bold">{currentTime.toLocaleTimeString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => { setView('employee'); setIsServerAuth(false); setServerPassword(''); }} className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium shadow-md text-sm" >
                            LOGOUT <LogOut className="w-4 h-4 inline ml-1"/>
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs (Tidak Berubah) */}
                <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
                    <div className="flex flex-wrap border-b border-gray-200">
                        {serverType === 'admin' && (
                            <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-4 md:px-6 py-4 font-bold transition-colors border-r ${ activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50' }`} >
                                <Users className="w-5 h-5" /> DASHBOARD
                            </button>
                        )}
                        <button onClick={() => setActiveTab('riwayat')} className={`flex items-center gap-2 px-4 md:px-6 py-4 font-bold transition-colors border-r ${ activeTab === 'riwayat' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50' }`} >
                            <FileText className="w-5 h-5" /> RIWAYAT
                        </button>
                        {serverType === 'admin' && (
                            <button onClick={() => setActiveTab('pengaturan')} className={`flex items-center gap-2 px-4 md:px-6 py-4 font-bold transition-colors ${ activeTab === 'pengaturan' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50' }`} >
                                <Key className="w-5 h-5" /> PENGATURAN
                            </button>
                        )}
                    </div>
                </div>
                
                {/* --- Konten Tab (Tidak Berubah) --- */}

                {/* Dashboard Tab (Admin Only) */}
                {activeTab === 'dashboard' && serverType === 'admin' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">TOTAL ABSENSI</p>
                                        <p className="text-4xl font-extrabold text-indigo-900">{stats.total}</p>
                                    </div>
                                    <FileText className="w-12 h-12 text-indigo-400 opacity-70" />
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">KELUAR KANTOR</p>
                                        <p className="text-4xl font-extrabold text-orange-600">{stats.keluar}</p>
                                    </div>
                                    <XCircle className="w-12 h-12 text-orange-400 opacity-70" />
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">MASUK KANTOR</p>
                                        <p className="text-4xl font-extrabold text-green-600">{stats.masuk}</p>
                                    </div>
                                    <CheckCircle className="w-12 h-12 text-green-400 opacity-70" />
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">TOTAL KARYAWAN</p>
                                        <p className="text-4xl font-extrabold text-purple-600">{stats.unique}</p>
                                    </div>
                                    <Users className="w-12 h-12 text-purple-400 opacity-70" />
                                </div>
                            </div>
                        </div>

                        {/* Recent Attendance */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">5 ABSENSI TERBARU</h3>
                            <div className="space-y-3">
                                {attendances.slice(0, 5).map((attendance) => (
                                    <div key={attendance.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                                        {attendance.photo ? (
                                            <button onClick={() => { setCurrentPhoto(attendance.photo); setShowPhotoModal(true); }}>
                                                <img src={attendance.photo} alt={attendance.name} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400" />
                                            </button>
                                        ) : <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xs">NO IMG</div>}
                                        
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-800">{attendance.name}</p>
                                            <p className="text-xs text-gray-500">{attendance.date} ({attendance.timestamp})</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${ attendance.type === 'masuk' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800' }`}> 
                                                {attendance.type.toUpperCase()} - {attendance.customTime}
                                            </span>
                                            <LocationDisplay locationData={attendance.location} />
                                        </div>
                                    </div>
                                ))}
                                {attendances.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">BELUM ADA DATA ABSENSI</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Riwayat Tab (Admin & PKD) */}
                {activeTab === 'riwayat' && (
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800"><FileText className="w-6 h-6 inline mr-2 text-indigo-600"/> RIWAYAT ABSENSI</h2>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="date" 
                                    value={filterDate} 
                                    onChange={(e) => setFilterDate(e.target.value)} 
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm" 
                                />
                                <button onClick={exportToCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md text-sm" > 
                                    <Download className="w-4 h-4" /> EXPORT CSV
                                </button>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">FOTO</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">NAMA</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">TIPE</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">WAKTU</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">TANGGAL</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">KEPERLUAN</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">LOKASI</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAttendances.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-8 text-center text-gray-500"> BELUM ADA DATA ABSENSI DENGAN FILTER INI </td>
                                        </tr>
                                    ) : (
                                        filteredAttendances.map((attendance) => (
                                            <tr key={attendance.id} className="hover:bg-indigo-50 transition-colors">
                                                <td className="px-4 py-3"> 
                                                    {attendance.photo && (
                                                        <button onClick={() => { setCurrentPhoto(attendance.photo); setShowPhotoModal(true); }} className="block">
                                                            <img src={attendance.photo} alt={attendance.name} className="w-10 h-10 rounded-full object-cover border border-gray-300 hover:border-indigo-600 transition-colors" />
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium">{attendance.name}</td>
                                                <td className="px-4 py-3"> 
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${ attendance.type === 'masuk' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800' }`}> 
                                                        {attendance.type.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-bold">{attendance.customTime}</td>
                                                <td className="px-4 py-3 text-sm">{attendance.date} ({attendance.timestamp})</td>
                                                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs overflow-hidden truncate">{attendance.purpose || '-'}</td>
                                                <td className="px-4 py-3">
                                                    <LocationDisplay locationData={attendance.location} />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {showPhotoModal && <PhotoModal photoUrl={currentPhoto} onClose={() => setShowPhotoModal(false)} />}


                {/* Pengaturan Tab (Admin Only) */}
                {activeTab === 'pengaturan' && serverType === 'admin' && (
                    <div className="space-y-6">
                        {/* Kelola Password */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-indigo-600"/> UBAH PASSWORD SERVER</h3>
                            <div className="space-y-4">
                                
                                {!showPasswordChange ? (
                                    <div className="flex flex-wrap gap-4">
                                        {['admin', 'pkd'].map(user => (
                                            <button 
                                                key={user}
                                                onClick={() => { setShowPasswordChange(true); setPasswordUserToChange(user); }} 
                                                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm" 
                                            > 
                                                <Key className="w-4 h-4" /> UBAH PASSWORD {user.toUpperCase()} 
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                        <p className="font-bold text-indigo-800">UBAH PASSWORD {passwordUserToChange.toUpperCase()}</p>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">PASSWORD BARU (MIN 6 KARAKTER)</label>
                                            <input 
                                                type="password" 
                                                value={newPassword} 
                                                onChange={(e) => setNewPassword(e.target.value)} 
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                                                placeholder="MASUKKAN PASSWORD BARU" 
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={handlePasswordChange} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium" > SIMPAN </button>
                                            <button onClick={() => { setShowPasswordChange(false); setNewPassword(''); }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium" > BATAL </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Kelola Karyawan */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><UserPlus className="w-5 h-5 text-purple-600"/> KELOLA KARYAWAN</h3>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 font-medium">TOTAL KARYAWAN: {employeeList.length} ORANG</p>
                                
                                {/* Form Tambah Karyawan */}
                                {!showAddEmployee ? (
                                    <button onClick={() => setShowAddEmployee(true)} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm" > 
                                        <UserPlus className="w-4 h-4" /> TAMBAH KARYAWAN BARU 
                                    </button>
                                ) : (
                                    <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">NAMA KARYAWAN BARU</label>
                                        <input 
                                            type="text" 
                                            value={newEmployeeName} 
                                            onChange={(e) => setNewEmployeeName(e.target.value.toUpperCase())} 
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase" 
                                            placeholder="MASUKKAN NAMA LENGKAP" 
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={handleAddEmployee} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium" > SIMPAN </button>
                                            <button onClick={() => { setShowAddEmployee(false); setNewEmployeeName(''); }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium" > BATAL </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Daftar Karyawan & Hapus */}
                            <div className="mt-6">
                                <h4 className="font-bold text-gray-700 mb-3">DAFTAR KARYAWAN (Klik Hapus):</h4>
                                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {employeeList.map((name, index) => (
                                            <div key={name} className="flex items-center justify-between text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded border border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-500">{index + 1}.</span> 
                                                    <span className="font-medium">{name}</span>
                                                </div>
                                                <button 
                                                    onClick={() => handleRemoveEmployee(name)} 
                                                    className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-100"
                                                    title={`Hapus ${name}`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal Foto (dipanggil di Riwayat dan Dashboard) */}
                {showPhotoModal && <PhotoModal photoUrl={currentPhoto} onClose={() => setShowPhotoModal(false)} />}
            </div>
        </div>
    );
};

export default AttendanceSystem;
