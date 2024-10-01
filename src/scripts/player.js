let currentAudio = null;

document.querySelectorAll('.audio-player').forEach((player, index) => {
    const audio = player.querySelector('audio');
    const currentTimeDisplay = player.querySelector(`#currentTime${index + 1}`);
    const durationDisplay = player.querySelector(`#duration${index + 1}`);
    const playBtn = player.querySelector(`#play${index + 1}`);
    const pauseBtn = player.querySelector(`#pause${index + 1}`);
    const seekbar = player.querySelector(`#seekbar${index + 1}`);
    const volumeControl = player.querySelector(`#volume${index + 1}`);
    const volumeBtn = player.querySelector(`#volumeBtn${index + 1}`);
    const volumeIcon = player.querySelector(`#volumeIcon${index + 1}`);

    let isMuted = false; // Variável para controle de mute

    playBtn.addEventListener('click', () => {
        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            const currentPlayBtn = document.querySelector(`#play${Array.from(document.querySelectorAll('audio')).indexOf(currentAudio) + 1}`);
            const currentPauseBtn = document.querySelector(`#pause${Array.from(document.querySelectorAll('audio')).indexOf(currentAudio) + 1}`);
            currentPlayBtn.style.display = 'inline';
            currentPauseBtn.style.display = 'none';
        }

        audio.play();
        currentAudio = audio;
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline';
    });

    pauseBtn.addEventListener('click', () => {
        audio.pause();
        playBtn.style.display = 'inline';
        pauseBtn.style.display = 'none';
        if (currentAudio === audio) {
            currentAudio = null;
        }
    });

    audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        seekbar.value = progress || 0;
    });

    seekbar.addEventListener('input', () => {
        const seekTime = (seekbar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });
    
    audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration;
        durationDisplay.textContent = formatTime(duration);
    });

    audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime;
        currentTimeDisplay.textContent = formatTime(currentTime);
        const progress = (currentTime / audio.duration) * 100;
        seekbar.value = progress || 0;
    });

    // Função para formatar o tempo em minutos e segundos
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    volumeControl.addEventListener('input', () => {
        audio.volume = volumeControl.value / 100;
        updateVolumeIcon();
    });

    volumeBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        audio.muted = isMuted;
        updateVolumeIcon();
    });

    function updateVolumeIcon() {
        if (audio.muted || audio.volume === 0) {
            volumeIcon.src = 'dist/images/sound-track/muted.svg'; // Caminho para o ícone de mute
            volumeControl.value = 0; // Ajusta o controle de volume
        } else {
            volumeIcon.src = 'dist/images/sound-track/volume.svg'; // Caminho para o ícone de volume
            volumeControl.value = audio.volume * 100; // Ajusta o controle de volume
        }
    }

    audio.addEventListener('ended', () => {
        playBtn.style.display = 'inline';
        pauseBtn.style.display = 'none';
        if (currentAudio === audio) {
            currentAudio = null;
        }
    });
});
