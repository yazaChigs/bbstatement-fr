import { ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

export class DateUtil {

  static getMonthNameFromDate(date: Date): string {
    const locale = 'en-us';
    const dayOfMonth = date.getDate();
    const dayOfWeek = date.toLocaleString(locale, {weekday: 'long'}).substring(0, 3);
    const month = date.toLocaleString(locale, {month: 'long'}).substring(0, 3);
    return dayOfMonth + ' ' + month + ', ' + dayOfWeek;
  }

  static getFriendlyName(date: Date): string {
    const locale = 'en-us';
    const dayOfMonth = date.getDate();
    const month = date.toLocaleString(locale, {month: 'long'}).substring(0, 3);
    const year = date.toLocaleString(locale, {year: '2-digit'});
    return dayOfMonth + ' ' + month + ' ' + year ;
  }

  static getNextDays(date: Date): string[] {
    const result = [];
    result.push(this.getMonthNameFromDate(date));
    for (let i = 1; i <= 6; i++) {
      const toUse = new Date();
      toUse.setDate(date.getDate() + i);
      result.push(this.getMonthNameFromDate(toUse));
    }
    return result;
  }

  static getDateDiff(date: Date, factor: number): Date {
    const toUse = new Date();
    toUse.setDate(date.getDate() + factor);
    return toUse;
  }

  static getYearsBetween(now: Date, then: Date): number {
    return Math.floor((now.getTime() - then.getTime()) / 12 / 30 / 24 / 3600 / 1000);
  }
  public static minLength(min: number): ValidatorFn | any {
    return (control: AbstractControl[]) => {
        if (!(control instanceof FormArray)) {
           return;
        }
        return control.length < min ? { minLength: true } : null;
    };
}
}
