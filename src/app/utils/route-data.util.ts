import { ActivatedRoute, Data } from '@angular/router';

export function getDeepestRouteData(route: ActivatedRoute): Data {
  let currentRoute = route;

  while (currentRoute.firstChild) {
    currentRoute = currentRoute.firstChild;
  }

  return currentRoute.snapshot.data;
}
