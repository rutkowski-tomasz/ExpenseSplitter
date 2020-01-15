import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CallService {
    private apiUrl: string;

    constructor(private http: HttpClient) {
        this.apiUrl = environment.apiUrl;
    }

    public get<T>(url: string, param: any = null) {
        return this.http.get<T>(this.buildUrl(url, param));
    }

    public post<T>(url: string, postBody: any) {

        const params = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        return this.http.post<T>(this.buildUrl(url), JSON.stringify(postBody), params);
    }

    public postForm<T>(url: string, data?: any): Observable<T> {

        return this.http.post<T>(this.buildUrl(url), this.buildFormData(data));
    }

    public put<T>(url: any, putData: any) {

        return this.http.put<T>(this.buildUrl(url), putData);
    }

    public delete<T>(url: string, param: any = null) {

        return this.http.delete<T>(this.buildUrl(url, param));
    }

    private buildUrl(url: string, data?: any) {
        const urlBuilder = [`${this.apiUrl}/${url}`, '?'];

        if (data) {
            for (const key of Object.keys(data)) {

                if (Array.isArray(data[key])) {

                    for (const arrayKey of Object.keys(data[key])) {
                        urlBuilder[urlBuilder.length] = `${key}=${data[key][arrayKey]}`;
                        urlBuilder[urlBuilder.length] = '&';
                    }

                } else {

                    urlBuilder[urlBuilder.length] = `${key}=${data[key]}`;
                    urlBuilder[urlBuilder.length] = '&';
                }
            }
        }

        urlBuilder.pop();
        return urlBuilder.join('');
    }

    private buildFormData(object: any): FormData {

        const formData: FormData = new FormData();
        if (object) {
            for (const key of Object.keys(object)) {
                formData.append(key, object[key]);
            }
        }

        return formData;
    }
}
