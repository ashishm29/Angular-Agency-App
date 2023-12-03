import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { addDoc } from '@firebase/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  level: LogLevel = LogLevel.All;

  constructor(
    private firestore: FirestoreService,
    private authService: AuthService
  ) {
    this.setlogLevel(LogLevel.All);
  }

  debug(msg: string, rawdata?: any, ...optionalParams: any[]) {
    this.writeToLog(msg, rawdata, LogLevel.Debug, optionalParams);
  }

  info(msg: string, rawdata?: any, ...optionalParams: any[]) {
    this.writeToLog(msg, rawdata, LogLevel.Info, optionalParams);
  }

  warn(msg: string, rawdata?: any, ...optionalParams: any[]) {
    this.writeToLog(msg, rawdata, LogLevel.Warn, optionalParams);
  }

  error(msg: string, rawdata: any, ...optionalParams: any[]) {
    this.writeToLog(msg, rawdata, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, rawdata: any, ...optionalParams: any[]) {
    this.writeToLog(msg, rawdata, LogLevel.Fatal, optionalParams);
  }

  log(msg: string, rawdata?: any, ...optionalParams: any[]) {
    this.writeToLog(msg, rawdata, LogLevel.All, optionalParams);
  }

  setlogLevel(level: LogLevel) {
    this.level = level;
  }

  private writeToLog(
    msg: string,
    rawdata: any,
    level: LogLevel,
    params: any[]
  ) {
    try {
      if (this.shouldLog(level)) {
        let value: Ilogger = {} as Ilogger;

        value.LogDate = new Date();
        value.LogLevel = LogLevel[level];
        value.Message = msg;
        if (rawdata) {
          value.RawData = rawdata ?? '';
        }
        if (params.length) {
          value.OptionalParams = JSON.stringify(params).toString();
        }

        value.User = this.authService.userDetails.username;

        this.LogToFireBase(value);

        // Log the value
        console.log(value);
      }
    } catch {}
  }

  private shouldLog(level: LogLevel): boolean {
    let ret: boolean = false;
    if (
      (level >= this.level && level !== LogLevel.Off) ||
      this.level === LogLevel.All
    ) {
      ret = true;
    }
    return ret;
  }

  private LogToFireBase(val: Ilogger) {
    addDoc(this.firestore.loggingCollectionInstance, { ...val });
  }

  // getAllLogs() {
  //   // return this.firestore.collection('logging').snapshotChanges();
  //   getDoc(this.firestore.loggingCollectionInstance);
  // }
}

export interface Ilogger {
  loggerId: string;
  LogDate: Date;
  LogLevel: string;
  Message: string;
  OptionalParams: any;
  RawData: any;
  User: any;
}

export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6,
}
