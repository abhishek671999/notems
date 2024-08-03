import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/homescreen/home/home.component';
import { PostLoginComponent } from './components/post-login/post-login.component';
import { TestComponent } from './components/shared/test/test.component';
import { NotfountComponent } from './components/shared/notfount/notfount.component';
import { authGuard2 } from './guard/auth/auth.guard';
import { ProfileComponent } from './components/shared/profile/profile.component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    },
    {
        path: 'login',
        loadChildren: () =>
            import('./components/homescreen/homescreen.module').then(m => m.HomescreenModule)
    },
    {
        path: 'home',
        canActivate: [authGuard2],
        component: PostLoginComponent
    },
    {
        path: 'profile',
        canActivate: [authGuard2],
        component: ProfileComponent
    },
    {
        path: 'manager',
        canActivate: [authGuard2],
        loadChildren: () => import('./components/manager-view/home/home.module').then(m => m.HomeModule)
    },
    {
        path: 'staff',
        canActivate: [authGuard2],
        loadChildren: () => import('./components/staff-view/home/home.module').then(m => m.HomeModule)
    },
    {
        path: 'test',
        canActivate: [authGuard2],
        component: TestComponent
    },
    { path: '**', component: NotfountComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
  })
  export class AppRoutingModule {}
  export const routingComponents = [];