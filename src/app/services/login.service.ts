import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../../models/iuser';
import {  Observable } from 'rxjs';
import { Loginuser } from '../../models/loginuser';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://2b-sohag.runasp.net/api/Account';
  constructor(private httpclient: HttpClient) {}
  UserRegister(user: IUser): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.httpclient.post(`${this.apiUrl}/Register`, user, { headers });
  }

  login(loginuser: Loginuser): Observable<any> {
    return this.httpclient.post(`${this.apiUrl}/Login`, loginuser);
  }
  logout() {
    sessionStorage.removeItem('token'); 
  }
}
//workstation id=2BEgypt.mssql.somee.com;packet size=4096;user id=mostafammalik751_SQLLogin_1;pwd=yxke1fqo8k;data source=2BEgypt.mssql.somee.com;persist security info=False;initial catalog=2BEgypt;TrustServerCertificate=True