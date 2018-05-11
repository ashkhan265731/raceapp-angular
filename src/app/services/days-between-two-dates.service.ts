import { Injectable } from '@angular/core';

@Injectable()
export class DaysBetweenTwoDatesService {

  constructor() { }

betweenDates(startDate,endDate){
  // Returns an array of dates between the two dates
    // console.log("dates");
    var dates = [],
      currentDate = startDate,
      addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
}

}
