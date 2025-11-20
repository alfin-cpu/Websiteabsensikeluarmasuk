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
                  <span>{currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{currentTime.toLocaleTimeString('id-ID')}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setView('employee');
                setIsServerAuth(false);
                setServerPassword('');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6 overflow-hidden">
          <div className="flex flex-wrap border-b">
            {serverType === 'admin' && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5" />
                DASHBOARD
              </button>
            )}
            <button
              onClick={() => setActiveTab('riwayat')}
              className={`flex items-center gap-2 px-4 md:px-6 py-4 font-medium transition-colors ${
                activeTab === 'riwayat'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              RIWAYAT
            </button>
            {serverType === 'admin' && (
              <button
                onClick={() => setActiveTab('pengaturan')}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 font-medium transition-colors ${
                  activeTab === 'pengaturan'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Key className="w-5 h-5" />
                PENGATURAN
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && serverType === 'admin' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">TOTAL ABSENSI</p>
                    <p className="text-3xl font-bold text-indigo-900">{stats.total}</p>
                  </div>
                  <FileText className="w-12 h-12 text-indigo-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">KELUAR KANTOR</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.keluar}</p>
                  </div>
                  <XCircle className="w-12 h-12 text-orange-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">MASUK KANTOR</p>
                    <p className="text-3xl font-bold text-green-600">{stats.masuk}</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">KARYAWAN</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.unique}</p>
                  </div>
                  <Users className="w-12 h-12 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Recent Attendance */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">ABSENSI TERBARU</h3>
              <div className="space-y-3">
                {attendances.slice(0, 5).map((attendance) => (
                  <div key={attendance.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    {attendance.photo && (
                      <img src={attendance.photo} alt={attendance.name} className="w-16 h-16 rounded-full object-cover" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{attendance.name}</p>
                      <p className="text-sm text-gray-500">{attendance.date} {attendance.timestamp}</p>
                      {attendance.purpose && attendance.purpose !== '-' && (
                        <p className="text-xs text-gray-600 mt-1">KEPERLUAN: {attendance.purpose}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      attendance.type === 'masuk' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {attendance.type === 'masuk' ? 'MASUK' : 'KELUAR'} - {attendance.customTime}
                    </span>
                  </div>
                ))}
                {attendances.length === 0 && (
                  <p className="text-center text-gray-500 py-8">BELUM ADA DATA ABSENSI</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Riwayat Tab */}
        {activeTab === 'riwayat' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">RIWAYAT ABSENSI</h2>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                EXPORT CSV
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">FILTER TANGGAL</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">FOTO</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">NAMA</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">TIPE</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">WAKTU</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">TANGGAL</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">KEPERLUAN</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">LOKASI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAttendances.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        BELUM ADA DATA ABSENSI
                      </td>
                    </tr>
                  ) : (
                    filteredAttendances.map((attendance) => (
                      <tr key={attendance.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {attendance.photo && (
                            <img src={attendance.photo} alt={attendance.name} className="w-12 h-12 rounded-full object-cover" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{attendance.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            attendance.type === 'masuk' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {attendance.type === 'masuk' ? 'MASUK' : 'KELUAR'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{attendance.customTime}</td>
                        <td className="px-4 py-3 text-sm">{attendance.date} {attendance.timestamp}</td>
                        <td className="px-4 py-3 text-sm">{attendance.purpose || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{attendance.location}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pengaturan Tab */}
        {activeTab === 'pengaturan' && serverType === 'admin' && (
          <div className="space-y-6">
            {/* Change Password */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">UBAH PASSWORD</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">PASSWORD SAAT INI</label>
                  <p className="text-sm text-gray-500">PASSWORD ADMIN: ••••••</p>
                  <p className="text-sm text-gray-500">PASSWORD PKD: ••••••</p>
                </div>
                {!showPasswordChange ? (
                  <button
                    onClick={() => setShowPasswordChange(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    UBAH PASSWORD {serverType.toUpperCase()}
                  </button>
                ) : (
                  <div className="space-y-3">
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
                      <button
                        onClick={handlePasswordChange}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        SIMPAN
                      </button>
                      <button
                        onClick={() => {
                          setShowPasswordChange(false);
                          setNewPassword('');
                        }}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        BATAL
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Add Employee */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">KELOLA KARYAWAN</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">TOTAL KARYAWAN: {employeeList.length} ORANG</p>
                </div>
                {!showAddEmployee ? (
                  <button
                    onClick={() => setShowAddEmployee(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    TAMBAH KARYAWAN BARU
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NAMA KARYAWAN BARU</label>
                      <input
                        type="text"
                        value={newEmployeeName}
                        onChange={(e) => setNewEmployeeName(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                        placeholder="MASUKKAN NAMA LENGKAP"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddEmployee}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        SIMPAN
                      </button>
                      <button
                        onClick={() => {
                          setShowAddEmployee(false);
                          setNewEmployeeName('');
                        }}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        BATAL
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Employee List */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-3">DAFTAR KARYAWAN:</h4>
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                    {employeeList.map((name, index) => (
                      <div key={name} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded">
                        <span className="font-medium text-gray-500">{index + 1}.</span>
                        <span>{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSystem;
