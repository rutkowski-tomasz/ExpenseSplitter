import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CallService {
    apiUrl: string;

    constructor(private http: HttpClient) {
        this.apiUrl = environment.apiUrl;
    }

    public get<T>(url: string, param: any = null) {
        const finalUrl = this.formUrlParam(url, param);
        return this.http.get(finalUrl, { withCredentials: true }).pipe(
            map(res => {
                return res as T;
            })
        );
    }

    public download(url: string, param: any = null) {
        const finalUrl = this.formUrlParam(url, param);
        return this.http
            .get(finalUrl, { responseType: 'blob', observe: 'response' })
            .pipe(
                map(res => {
                    return res;
                })
            );
    }

    post(url: string, postBody: any): any {
        return this.http
            .post(this.toAbsoluteUrl(url), JSON.stringify(postBody), {
                withCredentials: true,
                headers: new HttpHeaders({ 'Content-Type': 'application/json' })
            });
    }

    delete(url: string, param: any = null) {

        const finalUrl = this.formUrlParam(url, param);
        return this.http.delete(finalUrl, { withCredentials: true }).pipe(
            map(res => {
                return res;
            })
        );
    }

    put(url: any, putData: any) {
        return this.http
            .put(this.toAbsoluteUrl(url), putData, { withCredentials: true })
            .pipe(
                map(res => {
                    return res;
                })
            );
    }

    patch(url: any, putData: any) {
        return this.http
            .patch(this.toAbsoluteUrl(url), putData, { withCredentials: true })
            .pipe(
                map(res => {
                    return res;
                })
            );
    }

    postForm<T>(url: string, data?: any): Observable<T> {

        const formData = this.buildFormData(data);
        return this.http.post(
            this.toAbsoluteUrl(url),
            formData,
            { withCredentials: true }
        ) as Observable<T>;
    }

    formUrlParam(url: string, data?: any) {
        const urlBuilder = [this.toAbsoluteUrl(url), '?'];

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

    private toAbsoluteUrl(url: string) {
        const isAbsolute = new RegExp('^(?:[a-z]+:)?//', 'i').test(url);

        if (isAbsolute) {
            return url;
        } else {
            return `${this.apiUrl}/${url}`;
        }
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
