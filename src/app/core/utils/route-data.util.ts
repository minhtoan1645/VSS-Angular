import { ActivatedRoute, Data } from '@angular/router';

export function getDeepestRouteData(route: ActivatedRoute): Data {
  let currentRoute: ActivatedRoute | null = route;
  const routeData: Data = {};

  while (currentRoute) {
    Object.assign(routeData, currentRoute.snapshot.data);
    currentRoute = currentRoute.firstChild;
  }

  return routeData;
}
