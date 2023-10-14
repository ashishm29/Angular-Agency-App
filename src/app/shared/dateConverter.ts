export class dateConverter {
  static StringToDateTimeConverter(date: string) {
    if (date) {
      let dateTimeSplit = date.split(' ');
      let dateValues = dateTimeSplit[0].split('/');
      let timeValues = dateTimeSplit[1].split(':');

      let day = dateValues[0];
      let month = dateValues[1];
      let year = dateValues[2];

      let hour = timeValues[0];
      let minute = timeValues[1];
      let second = timeValues[2];

      return new Date(+year, +month, +day, +hour, +minute, +second);
    }

    return date;
  }

  static StringToDateConverter(date: string) {
    if (date) {
      let dateValues = date.split('/');

      let day = dateValues[0];
      let month = dateValues[1];
      let year = dateValues[2];

      return new Date(+year, +month, +day);
    }

    return date;
  }
}
