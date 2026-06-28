import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export interface MedicalRecord{

id:number;

appointmentId:number;

complaint:string;

diagnosis:string;

prescription:string;

exams:string;

observations:string;

}

@Injectable({

providedIn:'root'

})

export class MedicalRecordsService{

private api='http://localhost:3000/medical-records';

constructor(private http:HttpClient){}

getAll():Observable<MedicalRecord[]>{

return this.http.get<MedicalRecord[]>(this.api);

}

create(data:any){

return this.http.post(this.api,data);

}

update(id:number,data:any){

return this.http.put(`${this.api}/${id}`,data);

}

delete(id:number){

return this.http.delete(`${this.api}/${id}`);

}

}