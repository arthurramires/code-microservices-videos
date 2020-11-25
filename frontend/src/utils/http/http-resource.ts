import { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";

export default class httpResource {

    constructor(protected http: AxiosInstance, protected resource){}

    list<T = any>(options?: { queryParams? }): Promise<AxiosResponse<T>>{
        const config: AxiosRequestConfig = {};
        if(options && options.queryParams){
            config.params = options.queryParams;
        }
        return this.http.get<T>(this.resource);
    }

    get<T = any>(id){
        return this.http.get<T>(`${this.resource}/${id}`);
    }

    create<T = any>(data){
        return this.http.post<T>(this.resource, data);
    }

    update<T = any>(id, data){
        return this.http.put<T>(`${this.resource}/${id}`, data);
    }

    delete<T = any>(id){
        return this.http.delete<T>(`${this.resource}/${id}`);
    }
}