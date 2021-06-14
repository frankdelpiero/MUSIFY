import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import {UserService} from '../services/user.service';

@Component({
  selector:'user-edit',
  templateUrl: '../views/user-edit.html',
  providers: [UserService] 
})

export class UserEditComponent implements OnInit {
    public titulo:string;
    public user:User;
    public identity;
    public token;

    constructor(private _userService:UserService){
        this.titulo = 'Actualizar datos'
        // Datos almacenados que viajan con la sesion
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        // Campos rellenados automaticamente
        this.user = this.identity;
    }


    ngOnInit(){
        console.log("Componente UserEdit cargado");
    }

    onSubmit(){
        console.log(this.user);
    }
}