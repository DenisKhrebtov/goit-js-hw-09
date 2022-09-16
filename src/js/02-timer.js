import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const inputRef = document.querySelector('input#datetime-picker');
const startTimerRef = document.querySelector('button[data-start]');
const daysSpanRef = document.querySelector('span[data-days]');
const hoursSpanRef = document.querySelector('span[data-hours]');
const minutesSpanRef = document.querySelector('span[data-minutes]');
const secondsSpanRef = document.querySelector('span[data-seconds]');

let selectedTime = new Date().getTime();
startTimerRef.setAttribute('disabled', true);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedTime = selectedDates[0];
    if (selectedTime < new Date()) {
      Notiflix.Notify.warning('Please choose a date in the future');
    } else {
      startTimerRef.removeAttribute('disabled');
      Notiflix.Notify.success('Let`s start timer');
    }
  },
};

flatpickr('input#datetime-picker', options);

startTimerRef.addEventListener('click', onStartTimer);

function onStartTimer() {
  startTimerRef.setAttribute('disabled', true);
  inputRef.setAttribute('disabled', true);

  const intervalID = setInterval(() => {
    const currentTime = new Date();
    let deltaTime = selectedTime - currentTime;

    if (deltaTime >= 0) {
      const { days, hours, minutes, seconds } = convertMs(deltaTime);
      daysSpanRef.textContent = addLeadingZero(days);
      hoursSpanRef.textContent = addLeadingZero(hours);
      minutesSpanRef.textContent = addLeadingZero(minutes);
      secondsSpanRef.textContent = addLeadingZero(seconds);
      console.log(days, hours, minutes, seconds);
    } else {
      clearInterval(intervalID);
      startTimerRef.removeAttribute('disabled', true);
      inputRef.removeAttribute('disabled', true);
    }
  }, 1000);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
