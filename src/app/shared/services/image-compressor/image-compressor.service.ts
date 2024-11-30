import { Injectable } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Injectable({
  providedIn: 'root'
})
export class ImageCompressorService {

  constructor(private ng2ImgMax: Ng2ImgMaxService) { }

  compressImage(file: File) {
    const percentageReduction = 0.40;
    const targetFileSize = file.size * (1 - percentageReduction);
    const maxSizeInMB = targetFileSize * 0.000001;
    return this.ng2ImgMax.compressImage(file, maxSizeInMB)
  }
}
