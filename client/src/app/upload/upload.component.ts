import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  selectedFile: File = null;
  private baseUrl =  'http://localhost:3001';

  constructor(private http:HttpClient) { }

  ngOnInit() {
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  onUpload(){
    const fd = new FormData();
    
    if(this.selectedFile === undefined || this.selectedFile === null) {
      alert("Please select a file before uploading");
      return;
    }
    else{
      console.log(this.selectedFile.name);
      fd.append('datafile', this.selectedFile, this.selectedFile.name);
      this.http.post(`${this.baseUrl}/api/upload-file`, fd, {
        reportProgress: true, observe: 'events'
      }).subscribe(()=>{
        console.log("Uploaded to server");
        // alert("File uploaded to server");
      },(error)=>{
        console.log("Error is "+JSON.stringify(error));
      })
    }
  }
}


export class temperatureData{
  open: number;
  close: number;
  date: string | Date;
}