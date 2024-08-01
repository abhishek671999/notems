import { inject } from "@angular/core"
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router"
import { LoginService } from "../../shared/services/register/login.service"

export const authGuard2: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(LoginService).canActivate(next, state)
  }