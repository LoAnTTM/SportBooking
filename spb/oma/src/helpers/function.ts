import { jwtDecode } from 'jwt-decode';

import { CalendarEvent, CalendarSection } from '@/services/types';
import { OrderModel } from '@/types/model';

export function unicodeToASCII(str: string): string {
  const map: { [key: string]: string } = {
    a: 'áàảãạâấầẩẫậăắằẳẵặ',
    e: 'éèẻẽẹêếềểễệ',
    i: 'íìỉĩị',
    o: 'óòỏõọôốồổỗộơớờởỡợ',
    u: 'úùủũụưứừửữự',
    y: 'ýỳỷỹỵ',
    d: 'đ',
  };

  let result = str;

  for (const key in map) {
    const regex = new RegExp(`[${map[key]}]`, 'g');
    result = result.replace(regex, key);
  }

  return result;
}

export function numberTimeToDateTime(time: number): Date {
  const date = new Date();
  date.setHours(Math.floor(time), (time % 1) * 60, 0, 0);
  return date;
}

export function stringTimeToDateTime(dateString: string): Date {
  const date = new Date();
  const [hours, minutes] = dateString.split(':').map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function stringTimeToNumberTime(dateString: string): number {
  const [hours, minutes] = dateString.split(':').map(Number);
  return hours + minutes / 60;
}

export function dateTimeToStringTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function stringDateToDate(dateString: string): Date {
  const date = new Date(dateString);
  return date;
}

export function stringDateToNumberTime(dateString: string): number {
  const date = new Date(dateString);
  return date.getHours() + date.getMinutes() / 60;
}

export function numberTimeToString(time: number): string {
  const hours = Math.floor(time);
  const minutes = Math.round((time % 1) * 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}`;
}

function calculateDurationMinutes(start: string, end: string): number {
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return endMinutes - startMinutes;
}

function formatDurationLabel(minutes: number): string {
  if (minutes % 60 === 0) {
    return `${minutes / 60}h`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }
}

export function convertOrdersToCalendarData(
  orders: OrderModel[]
): CalendarSection[] {
  const mapByDate: Record<string, CalendarEvent[]> = {};

  orders.forEach((order) => {
    order.orderItems.forEach((item) => {
      const { bookedDay, startTime, endTime, itemName, price } = item;

      const durationMinutes = calculateDurationMinutes(startTime, endTime);
      const durationLabel = formatDurationLabel(durationMinutes);

      const event: CalendarEvent = {
        startTime: new Date(`${bookedDay}T${startTime}:00`),
        endTime: new Date(`${bookedDay}T${endTime}:00`),
        duration: durationLabel,
        title: itemName,
        price: price,
        currency: order.currency,
        id: item.itemId,
      };

      // Gán itemCustomHeightType: 'LongEvent' nếu duration > 2 giờ
      if (durationMinutes > 120) {
        event.itemCustomHeightType = 'LongEvent';
      }

      if (!mapByDate[bookedDay]) {
        mapByDate[bookedDay] = [];
      }

      console.log('bookedDay', bookedDay, event);
      mapByDate[bookedDay].push(event);
    });
  });

  const result: CalendarSection[] = Object.keys(mapByDate)
    .sort()
    .map((date) => {
      const sortedEvents = mapByDate[date].sort((a, b) => {
        const aTime = a.startTime.getTime();
        const bTime = b.startTime.getTime();

        return aTime - bTime;
      });

      return {
        title: date,
        data: sortedEvents,
      };
    });

  return result;
}

