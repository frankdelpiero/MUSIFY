import { Component, OnInit } from '@angular/core';
import { Console } from 'console';
import { User } from './models/user';
import {UserService} from './services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'Musify';
  public user:User;
  public user_register:User;
  public identity; // Comprueba el usuario logeado LocalStorage
  public token; //Propiedad a guardar en el localstorage
  public errorMessage;
  public alertRegister;
  constructor(    private _userService:UserService){
    // Inicio un usuario con los parametros vacios excepto el rol
    this.user = new User('','','','','','ROLE_USER','');
    // Inicio de un nuevo usuario registrandose en la base de datos
    this.user_register = new User('','','','','','ROLE_USER','');
  }

  //Aparece cada vez que iniciamos en esta página
  ngOnInit(){
    //Inicio las sesiones
    this.identity = this._userService.getIdentity();
    this.token =    this._userService.getToken();

    console.log("IDENTIDAD SESION: "+this.identity);
    console.log("TOKEN SESION: "+this.token);
  }

  public onSubmit(){
    //alert(this.user.email);
    console.log(this.user);
    this._userService.signup(this.user).subscribe(response => {
      //alert("La respuesta es "+response);
      let identity = response.user;
      this.identity = identity;
      if (!this.identity._id){
        alert("El usuario no se ha podido loguear correctamente");
      }else {
        // Crear un identificador de sesion local para el usuario
        localStorage.setItem('identity',JSON.stringify(identity));
        // Conseguir el token para que el usuario pueda loguearse correctamente
        // En este caso necesito el hash y por eso coloco el segundo parametro
        this._userService.signup(this.user,"true").subscribe(response => {
          let token = response.token;
          this.token = token;
          if (this.token.length <= 0){
            alert("El token no se ha podido obtener correctamente");
          }else {
            // Crear un identificador de sesion local para el usuario
                localStorage.setItem('token',token);
                //Borrado de los campos del usuario en caso de cerrar sesión
                this.user = new User('','','','','','ROLE_USER','');
          }
    
    
        },
        error => {
          var errorMessage = <any>error;
          var body = JSON.parse(error._body);
          if(errorMessage != null){
            this.errorMessage = body.message;
            console.log(error);
          }
        } );        

      }



    },
    error => {
      var errorMessage = <any>error;
      var body = JSON.parse(error._body);
      if(errorMessage != null){
        this.errorMessage = body.message;
        console.log(error);
      }
    } );
  }

  // Cerrar la sesion del usuario
  public logout(){
    localStorage.clear();
    this.destroySession();
  }
  //Restablecer la sesion y redirigirnos a la pagina principal
  public destroySession(){
    this.identity = null;
    this.token = null;
  }

  //Registro a un usuario
  public onSubmitRegister(){
    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;
        console.log(user._id);
        if (!user._id){
          this.alertRegister = "Error con el ID en el registro";
        } else {
          this.alertRegister= "Registro correcto. Dirigase al login y registrese con "+this.user_register.email;
        }
      },
      error => {
        var alertRegister = <any>error;
        var body = JSON.parse(error._body);
        if(alertRegister != null){
          this.alertRegister = body.message;
          console.log(error);
        }
      }
    );
  }
}

