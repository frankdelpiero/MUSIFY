//Fichero usado para la navegacion a traves de la página web
import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Importar componentes
import { UserEditComponent } from "./components/user-edit.component";

const appRoutes: Routes = [
    {path:'',component:UserEditComponent},
    {path:'mis-datos',component:UserEditComponent},
    {path:'**',component:UserEditComponent} // URL no reconocida
];

//Exporto las rutas
export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);