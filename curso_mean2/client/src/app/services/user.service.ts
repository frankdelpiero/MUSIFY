import {Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';

//Inyectar esa dependencias en otros modulos
@Injectable()
export class UserService{
    public url:string;
    public identity;
    public token;
    constructor(private _http:Http){
        this.url = GLOBAL.url;
    }

    signup(user_to_login,gethash = null){
        if (gethash != null){
            user_to_login.gethash = gethash;
        }
        let json = JSON.stringify(user_to_login);
        let params = json;
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'login',params,{headers:headers}).map(res => res.json());
    }

    getIdentity(){
        //Obtengo la identidad y compruebo que esta sea correcta
        let identity = JSON.parse(localStorage.getItem('identity'));
        if (identity != 'undefined'){
            this.identity = identity;
        }else{
            this.identity = null;
        }
        return this.identity;
    }
    //Obtengo el token y compruebo que este sea correcto
    getToken(){
        let token= localStorage.getItem('token');
        if (token == 'undefined'){
            this.token = null;
        } else{
            this.token = token;
        }
        return this.token;
    }
    //Registro de un usuario enviando al backend la peticion
    register(user_to_register){
        let json = JSON.stringify(user_to_register);
        let params = json;
        let headers = new Headers({'Content-Type':'application/json'});
        console.log(params);
        return this._http.post(this.url+'register',params,{headers:headers}).map(res => res.json());

    }

    // Actualizo a un usuario pasandole la url y el id de este mismo
    update_user(user_to_update){
        let json = JSON.stringify(user_to_update);
        let params = json;
        let headers = new Headers({'Content-Type':'application/json','Authorization':this.getToken()});
        console.log(params);
        return this._http.post(this.url+'update-user/'+user_to_update._id,params,{headers:headers}).map(res => res.json());
    }
}