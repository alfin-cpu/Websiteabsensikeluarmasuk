import React, { useState, useEffect } from 'react';
import { 
    Calendar, Clock, MapPin, Users, CheckCircle, XCircle, FileText, 
    Download, Lock, UserCheck, LogIn, LogOut, UserPlus, Key, Trash2, Home 
} from 'lucide-react';

// Fungsi bantuan untuk membuat URL Google Maps dari koordinat
const createMapLink = (lat, lng) => `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

const AttendanceSystem = () => {
    // --- State Management ---
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
    const [attendanceMode, setAttendanceMode] = useState('keluar'); 
    
    // Data Karyawan Awal (Dapat Diubah melalui Pengaturan)
    const [employeeList, setEmployeeList] = useState([
        'AGUNG TRI WARDANI', 'AHMAD SYAIFUL', 'AJI KURNIA RAMADHAN', 'ANAS FAUZI', 'ANAZYAH ZUROH', 'ANDI R FASHA JUANDI', 'ANTORO', 'ARI PURNOMO', 'ARIE SUPRIYANTO', 'ARIEF SUPRIYONO', 'ARIF WAHYUDI', 'ASA FATHIKHLAASH', 'AYI', 'AYOM WAHYU N', 'DESI APRILIENI', 'DEWI SARTIKA', 'DIMAS AR RASYID', 'DODY APRIYANA', 'ENDAY', 'GUSTAMININGSIH', 'HADI', 'HADI PURNOMO', 'HASANUDIN', 'HAYADI', 'HENDIYANA', 'INDRI SUSANTI', 'INRA EFFENDI ASRI', 'IRMA HARTINI', 'JOKO SUKENDRO', 'KHAIRUDDIN', 'LILI TOLANI', 'M ZAINAL RIZKI', 'MAMIK WIYANTO', 'MUHAMAD ALFAZRI', 'MUHAMMAD ALFINAS', 'MUHLISIN', 'NOPI HARYANTI', 'PRIYANTO', 'REVAN SAPUTRA', 'RUKMAN HAKIM', 'SAEPUDIN', 'SAHRONI', 'SANDI ALJABAR', 'SONY DARMAWAN', 'SUANDA', 'SUKASAH', 'SUPRIYANTO', 'SUWARNO', 'SUYARTO', 'TARMAN', 'TARJONO', 'TOYA SAMODRA', 'ULUT SURYANA', 'UYUM JUMHANA', 'WACA WIJAYA', 'WAHYUDIN', 'WAODE INDAH FARIDA', 'WARMIN', 'YAYAN HARYANTO', 'YATNO WIDIYATNO'
    ].sort());
    
    // Password untuk Login Server
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
                    setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
                },
                (error) => {
                    console.error("Error getting geolocation:", error);
                    setLocation({ lat: -6.1751, lng: 106.8650, failed: true });
                }
            );
        } else {
             console.warn("Geolocation not supported by this browser.");
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
        unique: employeeList.length 
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
                <img src={photoUrl} alt="Foto Absensi Karyawan" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
        </div>
    );
    
    // --- RENDER UTAMA ---

    // Tampilan 1: Login Server atau Pegawai
    if (view === 'employee' || !isServerAuth) {
        return (
            <div className="min-h-screen bg-gray-100 p-4 font-sans">
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
                                        <LogOut className="w-5 h-5" /> KELUAR 
                                    </button>
                                    <button 
                                        onClick={() => setAttendanceMode('masuk')} 
                                        className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-md ${
                                            attendanceMode === 'masuk' ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-teal-300/50' : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                                        }`}
                                    > 
                                        <LogIn className="w-5 h-5" /> MASUK
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
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-
