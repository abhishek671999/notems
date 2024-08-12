import { Component, Inject, SecurityContext } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from '../../../../shared/pipe/safe.pipe';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private domSanitizer: DomSanitizer,
  ) { 
    let url = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3699.384095066247!2d${this.data['longitude']}!3d${this.data['latitude']}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1721832483552!5m2!1sen!2sin`
    //let url = 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3699.384095066247!2d77.51962502328236!3d12.94941814767192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1721832483552!5m2!1sen!2sin'
    this.locationString = url
    this.googleMapsLocationString = `https://maps.google.com/?q=${this.data['latitude']},${this.data['longitude']}`

  }
  public googleMapsLocationString: string
  public locationString: string;
}
