function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;

    let timeString = '';
    if (hours > 0) {
        timeString += hours + 'h ';
    }
    if (minutes > 0 || hours > 0) {
        timeString += minutes + 'm ';
    }
    timeString += remainingSeconds + 's';

    return timeString.trim();
}

module.exports = {
    formatTime: formatTime,
}