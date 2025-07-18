import { Injectable } from "@angular/core";
import { PrintBuilder } from "./printbuilder";
import { PrintDriver } from "./printDriver";
import { BehaviorSubject } from "rxjs";
import { EscBuilder } from "./escbuilder";


@Injectable({
    providedIn: 'root'
})
export class PrintService extends PrintBuilder{

    public printLanguage?: string;
    public driver?: PrintDriver;
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public builder? : PrintBuilder;

    constructor(){
        super()
    }

    setDriver(driver: PrintDriver, printLanguage: string = 'ESC/POS'): PrintService{
        this.driver = driver;
        this.printLanguage = printLanguage;
        this.driver.connect()

        this.driver.isConnected.subscribe(result => {
            this.isConnected.next(result)
        })
        return this
    }
    

    init(): PrintService{
        if(!this.driver){
            throw "Cannot inititate the print service. No connection detected!! "
        }
        switch(this.printLanguage){
            case "WebPrint":
                break
            case "StarPRNT":
                break
            default:
                this.builder = new EscBuilder()
        }
        this.builder?.init()
        return this
    }
    
    /**
   *
   * @param cutType full|partial
   */
  public cut(cutType: string = 'full'): PrintService {
    this.builder?.cut(cutType);
    return this;
  }

  /**
   *
   * @param lineCount How many lines to feed
   */
  public feed(lineCount: number = 1): PrintService {
    this.builder?.feed(lineCount);
    return this;
  }

  setInverse(value: boolean = true): PrintService {
    this.builder?.setInverse(value);
    return this;

  }

  setBold(value: boolean = true): PrintService {
    this.builder?.setBold(value);
    return this;

  }

  setUnderline(value: boolean = true): PrintService {
    this.builder?.setUnderline(value);
    return this;

  }

  /**
   *
   * @param value left|center\right
   */
  setJustification(value: string = 'left'): PrintService {
    this.builder?.setJustification(value);
    return this;
  }

  /**
   *
   * @param value normal|large
   */
  setSize(value: string = 'normal'): PrintService {
    this.builder?.setSize(value);
    return this;
  }

  /**
   *
   * @param text
   */
  writeLine(text: string = ''): PrintService {
    this.builder?.writeLine(text);
    return this;
  }

  /**
   * write the current builder value to the driver and clear out the builder
   */
  flush() {
    this.driver?.write(this.builder?.flush());
  }

  writeCustomLine(printObj: any) {
    this.builder?.setBold(printObj.bold).setJustification(printObj.justification).setSize(printObj.size).setUnderline(false).writeLine(printObj.text).setBold(false).setJustification('left').setSize('normal').setUnderline(false).writeLine('')
    return this
  }
}