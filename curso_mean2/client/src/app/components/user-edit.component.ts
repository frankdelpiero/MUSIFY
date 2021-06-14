import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import {UserService} from '../services/user.service';
import { GLOBAL } from 'app/services/global';
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
    public filesToUpload:Array<File>;
    public url;
    public urlAll;
    constructor(private _userService:UserService){
        this.titulo = 'Actualizar datos'
        // Datos almacenados que viajan con la sesion
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        // Campos rellenados automaticamente
        this.user = this.identity;
        this.urlAll = GLOBAL.url;
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
                    if (!this.filesToUpload){
                        //Redireccion
                    } else {
                        this.urlAll = GLOBAL.url;
                        this.url = GLOBAL.url+'upload-image-user/'+this.user._id;
                        console.log(this.url);
                        this.makeFileRequest(this.url,[],this.filesToUpload).then(
                            (result:any) => {
                                this.user.image = result.image;
                                localStorage.setItem('identity',JSON.stringify(this.user));
                                let image_path= this.urlAll+'get-image-user/'+this.user.image;
                                console.log("IMAGEN: ",image_path);
                                document.getElementById('image-logged').setAttribute('src',image_path);
                                let elemento = document.getElementById('image-logged');
                                elemento.style.width = "10px";
                                elemento.style.height="10px";
                            }
                        ).catch(e=> {
							this.alertMessage = e;
							console.log(e);
						});
                    }
                   
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

    fileChangeEvent(fileInput:any){
        //Obtengo la entrada de archivos
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log("FILES ",this.filesToUpload);

    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>){
		var token = this.token;
		return new Promise(function(resolve, reject){
			var formData: any = new FormData();
			//variable de peticiones de ajax
			var xhr = new XMLHttpRequest();
			xhr.open('POST',url,true);
			xhr.setRequestHeader('Authorization', token);
			for (var i=0; i<files.length; i++){
				formData.append('file', files[i], files[i].name);				
			}
            console.log("DATA FORM: ",files[0].name);
			xhr.send(formData);
			
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if (xhr.status == 200){
						resolve(JSON.parse(xhr.response));
					}else{
						reject('Error al cargar la imagen. Compruebe si el formato o el tipo son correctos');
					}
				}
									
			};
			
		}); 

    }
}