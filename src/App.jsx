import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, FileText, Download, Lock, UserCheck, LogIn, LogOut, UserPlus, Key } from 'lucide-react';

const AttendanceSystem = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendances, setAttendances] = useState([]);
  const [view, setView] = useState('employee');
  const [serverPassword, setServerPassword] = useState('');
  const [isServerAuth, setIsServerAuth] = useState(false);
  const [serverType, setServerType] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    customTime: ''
  });
  const [location, setLocation] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [attendanceMode, setAttendanceMode] = useState('masuk');
  const [employeeList, setEmployeeList] = useState([
    'AGUNG TRI WARDANI', 'AHMAD SYAIFUL', 'AJI KURNIA RAMADHAN', 'ANAS FAUZI',
    'ANAZYAH ZUROH', 'ANDI R FASHA JUANDI', 'ANTORO', 'ARI PURNOMO',
    'ARIE SUPRIYANTO', 'ARIEF SUPRIYONO', 'ARIF WAHYUDI', 'ASA FATHIKHLAASH',
    'AYI', 'AYOM WAHYU N', 'DESI APRILIENI', 'DEWI SARTIKA',
    'DIMAS AR RASYID', 'DODY APRIYANA', 'ENDAY', 'GUSTAMININGSIH',
    'HADI', 'HADI PURNOMO', 'HASANUDIN', 'HAYADI',
    'HENDIYANA', 'INDRI SUSANTI', 'INRA EFFENDI ASRI', 'IRMA HARTINI',
    'JOKO SUKENDRO', 'KHAIRUDDIN', 'LILI TOLANI', 'M ZAINAL RIZKI',
    'MAMIK WIYANTO', 'MUHAMAD ALFAZRI', 'MUHAMMAD ALFINAS', 'MUHLISIN',
    'NOPI HARYANTI', 'PRIYANTO', 'REVAN SAPUTRA', 'RUKMAN HAKIM',
    'SAEPUDIN', 'SAHRONI', 'SANDI ALJABAR', 'SONY DARMAWAN',
    'SUANDA', 'SUKASAH', 'SUPRIYANTO', 'SUWARNO',
    'SUYARTO', 'TARMAN', 'TARJONO', 'TOYA SAMODRA',
    'ULUT SURYANA', 'UYUM JUMHANA', 'WACA WIJAYA', 'WAHYUDIN',
    'WAODE INDAH FARIDA', 'WARMIN', 'YAYAN HARYANTO', 'YATNO WIDIYATNO'
  ].sort());
  
  const [passwords, setPasswords] = useState({
    admin: 'admin123',
    pkd: 'pkd123'
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => setLocation({ lat: 0, lng: 0 })
      );
    }
  }, []);

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
    setPasswords({...passwords, [serverType]: newPassword});
    setNewPassword('');
    setShowPasswordChange(false);
    alert('PASSWORD BERHASIL DIUBAH!');
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

  const handleSubmitKeluar = () => {
    if (!formData.name) {
      alert('NAMA HARUS DIPILIH!');
      return;
    }
    if (!formData.customTime) {
      alert('WAKTU KELUAR HARUS DIISI!');
      return;
    }
    if (!formData.purpose) {
      alert('KEPERLUAN HARUS DIISI!');
      return;
    }
    if (!photo) {
      alert('FOTO HARUS DIAMBIL!');
      return;
    }
    
    const newAttendance = {
      id: Date.now(),
      name: formData.name,
      position: 'ANGGOTA',
      type: 'keluar',
      customTime: formData.customTime,
      purpose: formData.purpose,
      date: currentTime.toLocaleDateString('id-ID'),
      timestamp: currentTime.toLocaleTimeString('id-ID'),
      location: location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'LOKASI TIDAK TERSEDIA',
      photo: photoPreview,
      fullTimestamp: currentTime.toISOString()
    };

    setAttendances([newAttendance, ...attendances]);
    setFormData({ name: '', purpose: '', customTime: '' });
    setPhoto(null);
    setPhotoPreview(null);
    alert('✅ ABSENSI KELUAR BERHASIL DICATAT!');
  };

  const handleQuickAttendance = (employeeName) => {
    if (!photo) {
      alert('FOTO HARUS DIAMBIL TERLEBIH DAHULU!');
      return;
    }

    const currentTimeStr = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    const newAttendance = {
      id: Date.now(),
      name: employeeName,
      position: 'ANGGOTA',
      type: 'masuk',
      customTime: currentTimeStr,
      purpose: '-',
      date: currentTime.toLocaleDateString('id-ID'),
      timestamp: currentTime.toLocaleTimeString('id-ID'),
      location: location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'LOKASI TIDAK TERSEDIA',
      photo: photoPreview,
      fullTimestamp: currentTime.toISOString()
    };

    setAttendances([newAttendance, ...attendances]);
    setPhoto(null);
    setPhotoPreview(null);
    alert(`✅ ${employeeName} BERHASIL ABSEN MASUK!`);
  };

  const filteredAttendances = filterDate
    ? attendances.filter(a => a.date === new Date(filterDate).toLocaleDateString('id-ID'))
    : attendances;

  const stats = {
    total: attendances.length,
    keluar: attendances.filter(a => a.type === 'keluar').length,
    masuk: attendances.filter(a => a.type === 'masuk').length,
    unique: new Set(attendances.map(a => a.name)).size
  };

  const exportToCSV = () => {
    const headers = ['TANGGAL', 'WAKTU INPUT', 'NAMA', 'TIPE', 'WAKTU', 'KEPERLUAN', 'LOKASI'];
    const rows = filteredAttendances.map(a => 
      [a.date, a.timestamp, a.name, a.type.toUpperCase(), a.customTime, a.purpose || '-', a.location]
    );
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ABSENSI-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // View Login Server
  if (view === 'employee' || !isServerAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-2">ABSENSI KELUAR MASUK PPNPN</h1>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono text-lg">{currentTime.toLocaleTimeString('id-ID')}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setView('server');
                  setIsServerAuth(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span className="hidden md:inline">SERVER</span>
              </button>
            </div>
          </div>

          {view === 'server' && !isServerAuth ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">LOGIN SERVER</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PASSWORD</label>
                  <input
                    type="password"
                    value={serverPassword}
                    onChange={(e) => setServerPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleServerLogin()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
                    placeholder="MASUKKAN PASSWORD SERVER"
                  />
                </div>
                <button
                  onClick={handleServerLogin}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  LOGIN
                </button>
                <button
                  onClick={() => setView('employee')}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  KEMBALI
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mode Switch */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setAttendanceMode('masuk')}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      attendanceMode === 'masuk'
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <LogIn className="w-5 h-5" />
                    ABSEN MASUK
                  </button>
                  <button
                    onClick={() => setAttendanceMode('keluar')}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      attendanceMode === 'keluar'
                        ? 'bg-orange-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <LogOut className="w-5 h-5" />
                    ABSENSI KELUAR
                  </button>
                </div>
              </div>

              {/* Absen Masuk Mode */}
              {attendanceMode === 'masuk' ? (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">ABSEN MASUK</h2>
                  <p className="text-gray-600 text-sm mb-6">AMBIL FOTO, LALU PILIH NAMA ANDA UNTUK ABSEN MASUK</p>
                  
                  {/* Foto */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">FOTO WAJIB *</label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        onChange={handlePhotoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      {photoPreview && (
                        <div className="mt-3">
                          <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Employee List */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">PILIH NAMA ANDA *</label>
                    <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                      {employeeList.map((name) => (
                        <button
                          key={name}
                          onClick={() => handleQuickAttendance(name)}
                          className="w-full text-left px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg hover:from-green-100 hover:to-emerald-100 hover:border-green-400 transition-all font-medium text-gray-800 flex items-center justify-between group"
                        >
                          <span>{name}</span>
                          <CheckCircle className="w-5 h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900">INFO ABSEN MASUK:</p>
                        <ul className="text-xs text-green-700 mt-1 space-y-1">
                          <li>• TIPE: MASUK KANTOR</li>
                          <li>• WAKTU: OTOMATIS (SEKARANG)</li>
                          <li>• LOKASI: TERDETEKSI GPS</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Absensi Keluar Mode
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">ABSENSI KELUAR</h2>
                  <p className="text-red-600 text-sm font-medium mb-6">* SEMUA KOLOM WAJIB DIISI</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NAMA KARYAWAN *</label>
                      <select
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase"
                      >
                        <option value="">PILIH NAMA</option>
                        {employeeList.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">WAKTU KELUAR *</label>
                      <input
                        type="time"
                        value={formData.customTime}
                        onChange={(e) => setFormData({...formData, customTime: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">KEPERLUAN *</label>
                      <textarea
                        value={formData.purpose}
                        onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase"
                        placeholder="ISI KEPERLUAN KELUAR KANTOR"
                        rows="3"
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium">LOKASI SAAT INI</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'MEMUAT LOKASI...'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">FOTO *</label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          capture="user"
                          onChange={handlePhotoChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        {photoPreview && (
                          <div className="mt-3">
                            <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitKeluar}
                      className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserCheck className="w-5 h-5" />
                      CATAT ABSENSI KELUAR
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // View Server (Dashboard & Riwayat)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-2">
                {serverType === 'admin' ? 'DASHBOARD SERVER' : 'DASHBOARD PKD'}
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{currentTime.toLocaleDateString('id-ID'
