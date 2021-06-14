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
    public alertMessage;

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
        this._userService.updateUser(this.user).subscribe(
        response => {
                if (!response.user){
                    this.alertMessage = "El usuario no se ha actualizado";
                } else{
                    // Cambiamos los valores de localStorage
                    localStorage.setItem('identity',JSON.stringify(this.user));
                    //Para visualizarlo inmediatamente uso JavaScript.
                    document.getElementById('identity_name').innerHTML = this.user.name;
                    document.getElementById('identity_surname').innerHTML = this.user.surname;
                    this.alertMessage = "El usuario se ha actualizado.";
                }
            
            },
        error => {
            var errorMessage = <any>error;
            var body = JSON.parse(error._body);
            if(errorMessage != null){
                this.alertMessage = body.message;
                console.log(error);
            }
            }
        );
    }
}