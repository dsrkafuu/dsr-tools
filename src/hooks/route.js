import { useLocation } from 'react-router-dom';
import minimatch from 'minimatch';
import routes from '@/router/index';

/**
 * recursively match routes
 * @param {Array<Object>} routes
 * @param {string} path
 * @param {string} fatherPath
 */
function matchRoute(routes, path, fatherPath) {
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    // generate full path
    let pattern = fatherPath + '/';
    if (route.path && !route.index) {
      pattern += route.path;
    }
    pattern = pattern.replaceAll('//', '/');
    if (minimatch(path, pattern)) {
      return route;
    }
    // recursive match
    if (route.children) {
      for (let j = 0; j < route.children.length; j++) {
        // save father path for those has index but no path pages
        const match = matchRoute(route.children, path, pattern);
        if (match) {
          return match;
        }
      }
    }
  }
  return null;
}

// match cache
const cache = Object.create(null);

/**
 * get current matched route
 * @returns {Object|null}
 */
function useRoute() {
  const location = useLocation();
  const path = location.pathname;
  if (cache[path]) {
    return cache[path];
  } else {
    const matched = matchRoute(routes, path, '/');
    cache[path] = matched;
    return matched;
  }
}

export default useRoute;
