import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(relativeTime);
dayjs.extend(utc);
