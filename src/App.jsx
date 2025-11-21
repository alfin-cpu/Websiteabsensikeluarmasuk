import React, { useState, useEffect } from 'react';
import { 
    Calendar, Clock, MapPin, Users, CheckCircle, XCircle, FileText, 
    Download, Lock, UserCheck, LogIn, LogOut, UserPlus, Key, Trash2, Home, Settings 
} from 'lucide-react'; // Pastikan lucide-react sudah terinstal

// Fungsi bantuan untuk membuat URL Google Maps dari koordinat
const createMapLink = (lat, lng) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`; 

const AttendanceSystem = () => {
    // --- State Management ---
    const [currentTime, setCurrentTime] = useState(new Date());
    const [attendances, setAttendances] = useState([]);
    const [view, setView] = useState('employee'); // 'employee' atau 'server'
    const [serverPassword, setServerPassword] = useState('');
    const [isServerAuth, setIsServerAuth] = useState(false);
    const [serverType, setServerType] = useState(''); // 'admin' atau 'pkd'
    const [activeTab, setActiveTab] = useState('dashboard'); // untuk view 'server'
    const [formData, setFormData] = useState({ name: '', purpose: '', customTime: '' });
    const [location, setLocation] = useState(null); // { lat, lng, failed: boolean }
    const [filterDate, setFilterDate] = useState('');
    const [photo, setPhoto] = useState(null); // File object
    const [photoPreview, setPhotoPreview] = useState(null); // Data URL for preview
    const [attendanceMode, setAttendanceMode] = useState('keluar'); // 'keluar' atau 'masuk'
    
    // Data Karyawan Awal (Dapat Diubah melalui Pengaturan Admin)
    const [employeeList, setEmployeeList] = useState([
        'AGUNG TRI WARDANI', 'AHMAD SYAIFUL', 'AJI KURNIA RAMADHAN', 'ANAS FAUZI', 'ANAZYAH ZUROH', 'ANDI R FASHA JUANDI', 'ANTORO', 'ARI PURNOMO', 'ARIE SUPRIYANTO', 'ARIEF SUPRIYONO', 'ARIF WAHYUDI', 'ASA FATHIKHLAASH', 'AYI', 'AYOM WAHYU N', 'DESI APRILIENI', 'DEWI SARTIKA', 'DIMAS AR RASYID', 'DODY APRIYANA', 'ENDAY', 'GUSTAMININGSIH', 'HADI', 'HADI PURNOMO', 'HASANUDIN', 'HAYADI', 'HENDIYANA', 'INDRI SUSANTI', 'INRA EFFENDI ASRI', 'IRMA HARTINI', 'JOKO SUKENDRO', 'KHAIRUDDIN', 'LILI TOLANI', 'M ZAINAL RIZKI', 'MAMIK WIYANTO', 'MUHAMAD ALFAZRI', 'MUHAMMAD ALFINAS', 'MUHLISIN', 'NOPI HARYANTI', 'PRIYANTO', 'REVAN SAPUTRA', 'RUKMAN HAKIM', 'SAEPUDIN', 'SAHRONI', 'SANDI ALJABAR', 'SONY DARMAWAN', 'SUANDA', 'SUKASAH', 'SUPRIYANTO', 'SUWARNO', 'SUYARTO', 'TARMAN', 'TARJONO', 'TOYA SAMODRA', 'ULUT SURYANA', 'UYUM JUMHANA', 'WACA WIJAYA', 'WAHYUDIN', 'WAODE INDAH FARIDA', 'WARMIN', 'YAYAN HARYANTO', 'YATNO WIDIYATNO'
    ].sort());
    
    // Password untuk Login Server (sesuaikan jika perlu)
    const [passwords, setPasswords] = useState({ admin: 'admin123', pkd: 'pkd123' });
    
    // State untuk Pengaturan
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [passwordUserToChange, setPasswordUserToChange] = useState('admin');
    const [showAddEmployee, setShowAddEmployee] = useState(false);
    const [newEmployeeName, setNewEmployeeName] = useState('');

    // State untuk Riwayat
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState(null);

    // --- EFFECT HOOKS ---
    
    // 1. Update Waktu Setiap Detik
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 2. Ambil Lokasi GPS Awal
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({ lat: position.coords.latitude, lng: position.coords.longitude, failed: false });
                },
                (error) => {
                    console.error("Error getting geolocation:", error);
                    // Koordinat default jika gagal, misal KPU Tanjung Priok
                    setLocation({ lat: -6.1030, lng: 106.8837, failed: true }); 
                }
            );
        } else {
             console.warn("Geolocation not supported by this browser.");
             setLocation({ lat: -6.1030, lng: 106.8837, failed: true });
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
            setActiveTab('riwayat'); // PKD langsung ke Riwayat
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
            position: 'ANGGOTA', // Bisa disesuaikan jika ada field posisi
            type: type, // 'masuk' atau 'keluar'
            customTime: customTime,
            purpose: purpose,
            date: currentTime.toLocaleDateString('id-ID'),
            timestamp: currentTime.toLocaleTimeString('id-ID'),
            location: location.failed ? 'LOKASI TIDAK TERSEDIA' : `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`, 
            photo: photoPreview,
            fullTimestamp: currentTime.toISOString() // Untuk sorting
        };

        setAttendances([newAttendance, ...attendances]);
        setFormData({ name: '', purpose: '', customTime: '' });
        setPhoto(null);
        setPhotoPreview(null);
        return true;
    };

    // Absen Masuk Cepat
    const handleQuickAttendance = (employeeName) => {
        const currentTimeStr = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        if (createAttendanceRecord(employeeName, 'masuk', currentTimeStr)) {
            alert(`✅ ${employeeName} BERHASIL ABSEN MASUK!`);
        }
    };

    // Submit Absen Keluar
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
        unique: new Set(attendances.map(a => a.name)).size // Menghitung karyawan unik yang sudah absen
    };

    const exportToCSV = () => {
        const headers = ['TANGGAL', 'WAKTU INPUT', 'NAMA', 'TIPE', 'WAKTU', 'KEPERLUAN', 'LOKASI (Lat, Lng)'];
        const rows = filteredAttendances.map(a => [a.date, a.timestamp, a.name, a.type.toUpperCase(), a.customTime, a.purpose || '-', a.location.replace(/,/g, '')] );
        const csv = [headers, ...rows].map(row => row.join(';')).join('\n'); 
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
            <div className="bg-white rounded-xl p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-700 hover:text-red-500">
                        <XCircle className="w-6 h-6"/>
                    </button>
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">FOTO ABSENSI</h3>
                <img src={photoUrl} alt="Foto Absensi Karyawan" className="w-full h-48 object-cover rounded-lg shadow-lg" />
            </div>
        </div>
    );
    
    // --- RENDER UTAMA ---

    // Tampilan 1: Login Server atau Pegawai
    if (view === 'employee' || !isServerAuth) {
        return (
            <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased">
                <div className="max-w-2xl mx-auto">
                    {/* Header Utama - Lebih Elegan */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border-t-8 border-indigo-600/70 backdrop-blur-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-800 mb-1 leading-tight">SISTEM ABSENSI PPNPN</h1>
                                <p className="text-sm text-gray-500 font-semibold">KPU BEA DAN CUKAI TANJUNG PRIOK TIPE A</p>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-600 text-sm mt-3">
                                    <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 font-medium">
                                        <Calendar className="w-4 h-4" />
                                        <span>{currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-indigo-100 px-3 py-1 rounded-full text-indigo-800">
                                        <Clock className="w-4 h-4" />
                                        <span className="font-mono text-xl font-extrabold">{currentTime.toLocaleTimeString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => { setView('server'); setIsServerAuth(false); }} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-indigo-700 transition-all shadow-lg text-sm" >
                                <Lock className="w-4 h-4" /> SERVER
                            </button>
                        </div>
                    </div>

                    {/* Login Server */}
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 uppercase shadow-inner transition-shadow" 
                                        placeholder="MASUKKAN PASSWORD SERVER" 
                                    />
                                </div>
                                <button onClick={handleServerLogin} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-300/80" >
                                    <LogIn className="w-5 h-5 inline mr-2"/> LOGIN
                                </button>
                                <button onClick={() => setView('employee')} className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors" > 
                                    <Home className="w-4 h-4 inline mr-2"/> KEMBALI KE ABSENSI
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Tampilan Absensi Pegawai */
                        <div className="space-y-6">
                            
                            {/* Mode Switch & Lokasi - Dibuat Lebih Rapi */}
                            <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-200">
                                <div className="flex gap-3 w-full md:w-auto">
                                    <button 
                                        onClick={() => setAttendanceMode('keluar')} 
                                        className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-md ${
                                            attendanceMode === 'keluar' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-red-300/50' : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
                                        }`}
                                    >
                                        <LogOut className="w-5 h-5" /> ABSEN KELUAR 
                                    </button>
                                    <button 
                                        onClick={() => setAttendanceMode('masuk')} 
                                        className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-md ${
                                            attendanceMode === 'masuk' ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-teal-300/50' : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                                        }`}
                                    > 
                                        <LogIn className="w-5 h-5" /> ABSEN MASUK
                                    </button>
                                </div>
                                <div className="text-center md:text-right w-full md:w-auto p-2 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500">POSISI ANDA:</p>
                                    <div className="flex items-center justify-center md:justify-end">
                                        {location ? (
                                            <a 
                                                href={createMapLink(location.lat, location.lng)} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className={`flex items-center gap-1 text-sm font-bold ${location.failed ? 'text-red-500' : 'text-blue-600 hover:text-blue-700'}`}
                                            >
                                                <MapPin className="w-4 h-4" /> 
                                                {location.failed ? 'GPS ERROR' : 'LOKASI TERDETEKSI'}
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-4 h-4 animate-pulse"/>Memuat GPS...</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Absensi Keluar Mode */}
                            {attendanceMode === 'keluar' ? (
                                <div className="bg-white rounded-xl shadow-2xl p-6 border-t-8 border-orange-500">
                                    <h2 className="text-2xl font-extrabold text-gray-800 mb-2 flex items-center"><LogOut className='w-6 h-6 mr-2 text-orange-500'/> ABSENSI KELUAR</h2>
                                    <p className="text-orange-600 text-sm font-bold mb-6 border-b pb-2 border-dashed">Pastikan semua data terisi dan foto selfie Anda jelas.</p>
                                    <div className="space-y-5">
                                        {/* Nama */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">NAMA KARYAWAN <span className='text-red-500'>*</span></label>
                                            <select 
                                                value={formData.name} 
                                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 uppercase shadow-inner"
                                            >
                                                <option value="">-- PILIH NAMA DARI DAFTAR --</option>
                                                {employeeList.map((name) => (
                                                    <option key={name} value={name}>{name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Waktu */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">WAKTU KELUAR <span className='text-red-500'>*</span></label>
                                            <input 
                                                type="time" 
                                                value={formData.customTime} 
                                                onChange={(e) => setFormData({...formData, customTime: e.target.value})} 
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-inner" 
                                            />
                                        </div>
                                        {/* Keperluan */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">KEPERLUAN <span className='text-red-500'>*</span></label>
                                            <textarea 
                                                value={formData.purpose} 
                                                onChange={(e) => setFormData({...formData, purpose: e.target.value})} 
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 uppercase shadow-inner" 
                                                placeholder="Contoh: DINAS LUAR / KEPERLUAN PRIBADI" rows="3" 
                                            />
                                        </div>
                                        {/* Foto */}
                                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                                            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><UserCheck className="w-4 h-4 mr-1 text-orange-600"/> AMBIL FOTO SELFIE (WAJIB) <span className='text-red-500'>*</span></label>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                capture="user" 
                                                onChange={handlePhotoChange} 
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-200 file:text-orange-800 hover:file:bg-orange-300 transition-colors cursor-pointer"
                                            />
                                            {photoPreview && (
                                                <div className="mt-4 relative">
                                                    <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-xl border-4 border-orange-500 shadow-lg" />
                                                    <span className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full font-bold">PREVIEW</span>
                                                </div>
                                            )}
                                        </div>

                                        <button onClick={handleSubmitKeluar} className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-extrabold hover:from-orange-700 hover:to-red-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-300/80" > 
                                            <LogOut className="w-5 h-5" /> SUBMIT ABSENSI KELUAR
                                        </button>
                                    </div>
                                </div>
                            ) : ( 
                                {/* Absen Masuk Mode */}
                                <div className="bg-white rounded-xl shadow-2xl p-6 border-t-8 border-green-500">
                                    <h2 className="text-2xl font-extrabold text-gray-800 mb-2 flex items-center"><LogIn className='w-6 h-6 mr-2 text-green-500'/> ABSENSI MASUK</h2>
                                    <p className="text-gray-600 text-sm mb-6 border-b pb-2 border-dashed">Langkah Cepat: Ambil foto, lalu tekan nama Anda untuk absen.</p>

                                    {/* Foto */}
                                    <div className="mb-6 bg-green-50 p-4 rounded-xl border border-green-200">
                                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center"><UserCheck className="w-4 h-4 mr-1 text-green-600"/> AMBIL FOTO SELFIE (WAJIB) <span className='text-red-500'>*</span></label>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            capture="user" 
                                            onChange={handlePhotoChange} 
                                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-200 file:text-green-800 hover:file:bg-green-300 transition-colors cursor-pointer"
                                        />
                                        {photoPreview && (
                                            <div className="mt-4 relative">
                                                <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-xl border-4 border-green-500 shadow-lg" />
                                                <span className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full font-bold">PREVIEW</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Employee List */}
                                    <div>
                                        <label className="block text-base font-extrabold text-gray-800 mb-4">PILIH NAMA ANDA DI BAWAH <span className='text-red-500'>*</span></label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                                            {employeeList.map((name) => (
                                                <button 
                                                    key={name} 
                                                    onClick={() => handleQuickAttendance(name)} 
                                                    className="w-full text-left px-4 py-3 bg-white border border-green-300 rounded-xl hover:bg-green-50 hover:border-green-500 transition-all font-semibold text-gray-800 flex items-center justify-between group shadow-md text-sm"
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

    // Tampilan 2: Server (Admin & PKD)
    return (
        <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased">
            {showPhotoModal && <PhotoModal photoUrl={currentPhoto} onClose={() => setShowPhotoModal(false)} />}
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

                {/* Tabs Navigation */}
                <div className="flex bg-gray-200 rounded-xl p-2 gap-2 mt-6">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all ${
                            activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'
                        } ${serverType === 'pkd' ? 'hidden' : ''}`} // Sembunyikan untuk PKD
                    >
                        <Users className="w-4 h-4 inline mr-2"/> DASHBOARD
                    </button>
                    <button 
                        onClick={() => setActiveTab('riwayat')}
                        className={`flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all ${
                            activeTab === 'riwayat' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        <FileText className="w-4 h-4 inline mr-2"/> RIWAYAT ABSENSI
                    </button>
                    <button 
                        onClick={() => setActiveTab('pengaturan')}
                        className={`flex-1 px-6 py-3 text-sm font-semibold rounded-lg transition-all ${
                            activeTab === 'pengaturan' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'
                        } ${serverType === 'pkd' ? 'hidden' : ''}`} // Sembunyikan untuk PKD
                    >
                        <Settings className="w-4 h-4 inline mr-2"/> PENGATURAN
                    </button>
                </div>

                {/* Content Area Based on Active Tab */}
                <div className="mt-6">
                    {activeTab === 'dashboard' && serverType === 'admin' && (
                        <div className="bg-white rounded-xl shadow-2xl p-6 border-t-8 border-indigo-500">
                            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center"><Users className="w-6 h-6 mr-2 text-indigo-500"/> STATISTIK HARI INI</h2>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between shadow-sm border border-blue-200">
                                    <div className="text-blue-700">
                                        <p className="text-xs font-medium">TOTAL ABSENSI</p>
                                        <p className="text-2xl font-bold">{stats.total}</p>
                                    </div>
                                    <FileText className="w-8 h-8 text-blue-400 opacity-60"/>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between shadow-sm border border-green-200">
                                    <div className="text-green-700">
                                        <p className="text-xs font-medium">ABSEN MASUK</p>
                                        <p className="text-2xl font-bold">{stats.masuk}</p>
                                    </div>
                                    <LogIn className="w-8 h-8 text-green-400 opacity-60"/>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg flex items-center justify-between shadow-sm border border-red-200">
                                    <div className="text-red-700">
                                        <p className="text-xs font-medium">ABSEN KELUAR</p>
                                        <p className="text-2xl font-bold">{stats.keluar}</p>
                                    </div>
                                    <LogOut className="w-8 h-8 text-red-400 opacity-60"/>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg flex items-center justify-between shadow-sm border border-purple-200">
                                    <div className="text-purple-700">
                                        <p className="text-xs font-medium">KARYAWAN UNIK</p>
                                        <p className="text-2xl font-bold">{stats.unique}</p>
                                    </div>
                                    <UserCheck className="w-8 h-8 text-purple-400 opacity-60"/>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm italic border-t pt-4">Data ini diperbarui secara real-time.</p>
                        </div>
                    )}

                    {/* Riwayat Absensi Tab */}
                    {(activeTab === 'riwayat' && isServerAuth) && (
                        <div className="bg-white rounded-xl shadow-2xl p-6 border-t-8 border-indigo-500">
                            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center">
                                <FileText className="w-6 h-6 mr-2 text-indigo-500"/> RIWAYAT ABSENSI ({filteredAttendances.length} DATA)
                            </h2>
                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                <input 
                                    type="date" 
                                    value={filterDate} 
                                    onChange={(e) => setFilterDate(e.target.value)} 
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner" 
                                />
                                <button onClick={exportToCSV} className="sm:w-auto bg-green-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md">
                                    <Download className="w-5 h-5"/> EXPORT CSV
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TANGGAL</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WAKTU INPUT</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAMA</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIPE</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WAKTU</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KEPERLUAN</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOKASI</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FOTO</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredAttendances.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="px-4 py-4 text-sm text-gray-500 text-center">TIDAK ADA DATA ABSENSI.</td>
                                            </tr>
                                        ) : (
                                            filteredAttendances.map((a) => (
                                                <tr key={a.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{a.date}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{a.timestamp}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 uppercase">{a.name}</td>
                                                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-bold ${a.type === 'masuk' ? 'text-green-600' : 'text-red-600'}`}>{a.type.toUpperCase()}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{a.customTime}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{a.purpose}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                        <LocationDisplay locationData={a.location} />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                                        {a.photo ? (
                                                            <button 
                                                                onClick={() => { setCurrentPhoto(a.photo); setShowPhotoModal(true); }}
                                                                className="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center gap-1"
                                                            >
                                                                <img src={a.photo} alt="thumbnail" className="w-8 h-8 object-cover rounded-full border border-blue-300"/> Lihat
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">Tidak Ada</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Pengaturan Tab (Hanya Admin) */}
                    {(activeTab === 'pengaturan' && serverType === 'admin' && isServerAuth) && (
                        <div className="bg-white rounded-xl shadow-2xl p-6 border-t-8 border-indigo-500">
                            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center"><Settings className="w-6 h-6 mr-2 text-indigo-500"/> PENGATURAN ADMIN</h2>

                            {/* Ganti Password */}
                            <div className="mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                                <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center"><Key className="w-5 h-5 mr-2"/> GANTI PASSWORD SERVER</h3>
                                {!showPasswordChange ? (
                                    <button onClick={() => setShowPasswordChange(true)} className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md">
                                        Ganti Password
                                    </button>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">PILIH PENGGUNA</label>
                                            <select 
                                                value={passwordUserToChange} 
                                                onChange={(e) => setPasswordUserToChange(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="pkd">PKD</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">PASSWORD BARU</label>
                                            <input 
                                                type="password" 
                                                value={newPassword} 
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-inner" 
                                                placeholder="MINIMAL 6 KARAKTER" 
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={handlePasswordChange} className="flex-1 bg-indigo-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-md">
                                                SIMPAN
                                            </button>
                                            <button onClick={() => setShowPasswordChange(false)} className="flex-1 bg-gray-200 text-gray-700 px-5 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                                                BATAL
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Manajemen Karyawan */}
                            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center"><Users className="w-5 h-5 mr-2"/> MANAJEMEN KARYAWAN</h3>

                                {/* Tambah Karyawan */}
                                <div className="mb-6">
                                    {!showAddEmployee ? (
                                        <button onClick={() => setShowAddEmployee(true)} className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md">
                                            <UserPlus className="w-4 h-4 inline mr-2"/> Tambah Karyawan Baru
                                        </button>
                                    ) : (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">NAMA KARYAWAN BARU</label>
                                                <input 
                                                    type="text" 
                                                    value={newEmployeeName} 
                                                    onChange={(e) => setNewEmployeeName(e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 uppercase shadow-inner" 
                                                    placeholder="NAMA LENGKAP KARYAWAN" 
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={handleAddEmployee} className="flex-1 bg-green-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md">
                                                    TAMBAH
                                                </button>
                                                <button onClick={() => setShowAddEmployee(false)} className="flex-1 bg-gray-200 text-gray-700 px-5 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                                                    BATAL
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Daftar Karyawan */}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">DAFTAR KARYAWAN ({employeeList.length})</h4>
                                    <div className="max-h-60 overflow-y-auto p-2 bg-gray-100 rounded-lg border border-gray-200">
                                        {employeeList.length === 0 ? (
                                            <p className="text-sm text-gray-500 text-center py-4">BELUM ADA KARYAWAN DALAM DAFTAR.</p>
                                        ) : (
                                            <ul className="space-y-2">
                                                {employeeList.map((name) => (
                                                    <li key={name} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                                        <span className="font-medium text-gray-700 uppercase">{name}</span>
                                                        <button 
                                                            onClick={() => handleRemoveEmployee(name)} 
                                                            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                                                            aria-label={`Hapus karyawan ${name}`}
                                                        >
                                                            <Trash2 className="w-5 h-5"/>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);
