var countdownDate = new Date(document.getElementById("end_time").innerHTML);
document.getElementById("start_time").innerHTML = 'Start Time: ' + printDate(new Date(document.getElementById("start_time").innerHTML));
document.getElementById("end_time").innerHTML = 'End Time: ' + printDate(countdownDate);

function printDate(date) {
    var monthList = new Array(
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    );
    return date.getDate() + ' ' + monthList[date.getMonth()] + ' ' + date.getFullYear() + ' ' + date.toLocaleTimeString();
}

function countdownTimer() {
    function check(t) {
        if(t < 10) {
            t = '0' + t;
        }
        return t;
    }
    var differenceDates = countdownDate.getTime() - (new Date().getTime());

    // Time calculations for days, hours, minutes and seconds
    var days = check(Math.floor(differenceDates / (1000 * 60 * 60 * 24)));
    var hours = check(Math.floor((differenceDates % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    var minutes = check(Math.floor((differenceDates % (1000 * 60 * 60)) / (1000 * 60)));
    var seconds = check(Math.floor((differenceDates % (1000 * 60)) / 1000));

    document.getElementById("countdown_timer").innerHTML = hours + ":" + minutes + ":" + seconds;

    if (differenceDates < 0) {
        console.log(interval_countdownTimer);
        clearInterval(interval_countdownTimer);
        document.getElementById("response_form").submit();
        document.getElementById("countdown_timer").innerHTML = "EXPIRED";
    }
}
countdownTimer();
var interval_countdownTimer = setInterval(countdownTimer, 1000);
