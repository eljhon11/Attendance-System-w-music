// Sample attendance data
let attendanceData = [
    { id: 'FSD001', name: 'Earl Jay Pamaus', class: 'FSD-102', time: '09:15 AM', status: 'Present' },
    { id: 'FSD002', name: 'lyle Bryan Biadnes', class: 'FSD-102', time: '09:45 AM', status: 'Late' },
    { id: 'FSD003', name: 'Eugene Troy Manlino', class: 'FSD-102', time: '', status: 'Absent' },
    { id: 'FSD004', name: 'Marc Banuelos', class: 'FSD-102', time: '09:05 AM', status: 'Present' },
    { id: 'FSD004', name: 'El Jhon Quiachon', class: 'FSD-101', time: '09:05 AM', status: 'Present' },
    { id: 'FSD004', name: 'Meldane Mhae Magsubar', class: 'FSD-101', time: '09:05 AM', status: 'Present' },
    { id: 'FSD004', name: 'Elizxandhrea Danielle M. Quiachon', class: 'FSD-101', time: '09:05 AM', status: 'Present' },
    { id: 'FSD004', name: 'Fjor Jhon Raven M. Quiachon', class: 'FSD-101', time: '09:05 AM', status: 'Present' },
    { id: 'FSD004', name: 'Ken Gutierrez', class: 'FSD-102', time: '09:05 AM', status: 'Present' },
    { id: 'FSD004', name: 'Kelvin Turno', class: 'FSD-102', time: '09:05 AM', status: 'Present' },
    { id: 'FSD004', name: 'Arjay Repalam', class: 'FSD-102', time: '09:05 AM', status: 'Present' },
    { id: 'FSD004', name: 'James Ryan Banguis', class: 'FSD-102', time: '09:05 AM', status: 'Present' },
    { id: 'FSD004', name: 'Ken Gutierrez', class: 'FSD-102', time: '09:05 AM', status: 'Present' },
    { id: 'FSD004', name: 'El Sandro Quiachon', class: 'FSD-102', time: '09:05 AM', status: 'Present' },
    { id: 'FSD004', name: 'Joshua Ababa', class: 'FSD-102', time: '09:05 AM', status: 'Present' },
    { id: 'FSD005', name: 'Elcer Padillo', class: 'FSD-102', time: '09:10 AM', status: 'Present' }
];

// Sample music data
const songs = [
    { 
        title: 'Anxiety', 
        artist: 'Study Beats', 
        duration: '3:45', 
        src: 'Doechii - Anxiety (Visualizer).mp3' 
    },
    { 
        title: 'Cheri Cheri Lady', 
        artist: 'Focus Flow', 
        duration: '4:12', 
        src: 'ytmp3free.cc_cherry-cherry-lady-slowedreverb-youtubemp3free.org.mp3' 
    },
    { 
        title: 'Elegy', 
        artist: 'Dev Tunes', 
        duration: '2:58', 
        src: 'ytmp3free.cc_thefatrat-elegy-jackpot-ep-track-4-youtubemp3free.org.mp3' 
    }
];

// DOM Elements
const attendanceTable = document.getElementById('attendanceTable');
const searchInput = document.getElementById('searchInput');
const classFilter = document.getElementById('classFilter');
const statusFilter = document.getElementById('statusFilter');
const dateFilter = document.getElementById('dateFilter');
const addBtn = document.getElementById('addBtn');
const musicToggle = document.getElementById('musicToggle');
const musicModal = document.getElementById('musicModal');
const closeMusicModal = document.getElementById('closeMusicModal');
const songList = document.getElementById('songList');
const audioPlayer = document.getElementById('audioPlayer');
const volumeSlider = document.getElementById('volumeSlider');
const nowPlaying = document.getElementById('nowPlaying');
const playPauseIcon = document.getElementById('playPauseIcon');
const addModal = document.getElementById('addModal');
const closeAddModal = document.getElementById('closeAddModal');
const attendanceForm = document.getElementById('attendanceForm');
const visualizer = document.getElementById('visualizer');

// Audio Context for Visualizer
let audioContext;
let analyser;
let dataArray;
let canvasCtx = visualizer.getContext('2d');
visualizer.width = window.innerWidth;
visualizer.height = window.innerHeight;

// Initialize the app
function init() {
    renderAttendanceTable();
    renderSongList();
    setupEventListeners();
    setupAudioVisualizer();
}

// Render attendance table
function renderAttendanceTable(data = attendanceData) {
    attendanceTable.innerHTML = '';
    
    data.forEach(record => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${record.id}</td>
            <td>${record.name}</td>
            <td>${record.class}</td>
            <td>${record.time || '-'}</td>
            <td><span class="status status-${record.status.toLowerCase()}">${record.status}</span></td>
            <td>
                <div class="actions">
                    <button class="action-btn edit-btn" data-id="${record.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${record.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        attendanceTable.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => editRecord(e.target.closest('button').dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => deleteRecord(e.target.closest('button').dataset.id));
    });
}

// Filter attendance records
function filterAttendance() {
    const searchTerm = searchInput.value.toLowerCase();
    const classValue = classFilter.value;
    const statusValue = statusFilter.value;
    
    let filteredData = attendanceData.filter(record => {
        const matchesSearch = record.name.toLowerCase().includes(searchTerm) || 
                            record.id.toLowerCase().includes(searchTerm);
        const matchesClass = classValue === 'all' || record.class === classValue;
        const matchesStatus = statusValue === 'all' || record.status === statusValue;
        
        return matchesSearch && matchesClass && matchesStatus;
    });
    
    renderAttendanceTable(filteredData);
}

// Add new attendance record
function addRecord(record) {
    attendanceData.unshift(record);
    renderAttendanceTable();
    closeAddModal();
}

// Edit attendance record
function editRecord(id) {
    const record = attendanceData.find(r => r.id === id);
    if (record) {
        // Populate the form with record data
        document.getElementById('studentId').value = record.id;
        document.getElementById('studentName').value = record.name;
        document.getElementById('studentClass').value = record.class;
        document.getElementById('status').value = record.status;
        
        // Format time for input (remove AM/PM)
        if (record.time) {
            const [time, period] = record.time.split(' ');
            document.getElementById('time').value = time;
        } else {
            document.getElementById('time').value = '';
        }
        
        // Open the modal
        addModal.style.display = 'flex';
    }
}

// Delete attendance record
function deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        attendanceData = attendanceData.filter(record => record.id !== id);
        renderAttendanceTable();
    }
}

// Render song list
function renderSongList() {
    songList.innerHTML = '';
    
    songs.forEach(song => {
        const li = document.createElement('li');
        li.className = 'song-item';
        li.setAttribute('data-src', song.src);
        
        li.innerHTML = `
            <div class="song-info">
                <div class="song-cover">
                    <i class="fas fa-music"></i>
                </div>
                <div>
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
            </div>
            <div class="song-duration">${song.duration}</div>
        `;
        
        songList.appendChild(li);
    });
}

// Setup audio visualizer
function setupAudioVisualizer() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    const source = audioContext.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    drawVisualizer();
}

// Draw audio visualizer
function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    
    analyser.getByteFrequencyData(dataArray);
    
    canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    canvasCtx.fillRect(0, 0, visualizer.width, visualizer.height);
    
    const barWidth = (visualizer.width / analyser.frequencyBinCount) * 2.5;
    let x = 0;
    
    for (let i = 0; i < analyser.frequencyBinCount; i++) {
        const barHeight = dataArray[i] / 2;
        
        // Create gradient
        const hue = i * 2;
        canvasCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        canvasCtx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Filter event listeners
    searchInput.addEventListener('input', filterAttendance);
    classFilter.addEventListener('change', filterAttendance);
    statusFilter.addEventListener('change', filterAttendance);
    dateFilter.addEventListener('change', filterAttendance);
    
    // Add record button
    addBtn.addEventListener('click', () => {
        // Reset form
        attendanceForm.reset();
        addModal.style.display = 'flex';
    });
    
    // Music player toggle
    musicToggle.addEventListener('click', () => {
        musicModal.style.display = 'flex';
    });
    
    closeMusicModal.addEventListener('click', () => {
        musicModal.style.display = 'none';
    });
    
    closeAddModal.addEventListener('click', () => {
        addModal.style.display = 'none';
    });
    
    // Song selection
    songList.addEventListener('click', (e) => {
        const songItem = e.target.closest('.song-item');
        if (songItem) {
            // Remove active class from all songs
            document.querySelectorAll('.song-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to selected song
            songItem.classList.add('active');
            
            // Get song details
            const songTitle = songItem.querySelector('.song-title').textContent;
            const songArtist = songItem.querySelector('.song-artist').textContent;
            const songSrc = songItem.getAttribute('data-src');
            
            // Update now playing info
            nowPlaying.textContent = `${songTitle} - ${songArtist}`;
            
            // Set audio source
            audioPlayer.src = songSrc;
            
            // Play the song
            audioPlayer.play();
            playPauseIcon.classList.remove('fa-play');
            playPauseIcon.classList.add('fa-pause');
        }
    });
    
    // Play/pause toggle
    musicToggle.addEventListener('click', (e) => {
        if (audioPlayer.src) {
            e.stopPropagation();
            if (audioPlayer.paused) {
                audioPlayer.play();
                playPauseIcon.classList.remove('fa-play');
                playPauseIcon.classList.add('fa-pause');
            } else {
                audioPlayer.pause();
                playPauseIcon.classList.remove('fa-pause');
                playPauseIcon.classList.add('fa-play');
            }
        }
    });
    
    // Volume control
    volumeSlider.addEventListener('input', function() {
        audioPlayer.volume = this.value;
    });
    
    // When song ends
    audioPlayer.addEventListener('ended', function() {
        const currentSong = document.querySelector('.song-item.active');
        if (currentSong && currentSong.nextElementSibling) {
            currentSong.nextElementSibling.click();
        } else {
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
        }
    });
    
    // Attendance form submission
    attendanceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const studentId = document.getElementById('studentId').value;
        const studentName = document.getElementById('studentName').value;
        const studentClass = document.getElementById('studentClass').value;
        const status = document.getElementById('status').value;
        let time = document.getElementById('time').value;
        
        // Format time (convert to AM/PM)
        if (time) {
            const [hours, minutes] = time.split(':');
            const hourNum = parseInt(hours);
            const ampm = hourNum >= 12 ? 'PM' : 'AM';
            const hour12 = hourNum % 12 || 12;
            time = `${hour12}:${minutes} ${ampm}`;
        }
        
        // Check if we're editing an existing record
        const existingRecordIndex = attendanceData.findIndex(r => r.id === studentId);
        
        if (existingRecordIndex >= 0) {
            // Update existing record
            attendanceData[existingRecordIndex] = {
                id: studentId,
                name: studentName,
                class: studentClass,
                time: status === 'Present' || status === 'Late' ? time : '',
                status: status
            };
        } else {
            // Add new record
            const newRecord = {
                id: studentId,
                name: studentName,
                class: studentClass,
                time: status === 'Present' || status === 'Late' ? time : '',
                status: status
            };
            attendanceData.unshift(newRecord);
        }
        
        renderAttendanceTable();
        addModal.style.display = 'none';
    });
    
    // Window resize for visualizer
    window.addEventListener('resize', function() {
        visualizer.width = window.innerWidth;
        visualizer.height = window.innerHeight;
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === musicModal) {
            musicModal.style.display = 'none';
        }
        if (e.target === addModal) {
            addModal.style.display = 'none';
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);