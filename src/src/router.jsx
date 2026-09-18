import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const RouterContext = createContext(null);

export function BrowserRouter({ children }) {
  const [location, setLocation] = useState(() => ({
    pathname: window.location.pathname || '/',
    search: window.location.search || '',
    hash: window.location.hash || '',
    state: window.history.state || null
  }));

  useEffect(() => {
    const handlePopState = (event) => {
      setLocation({
        pathname: window.location.pathname || '/',
        search: window.location.search || '',
        hash: window.location.hash || '',
        state: event.state || null
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to, options = {}) => {
    let targetPath = typeof to === 'string' ? to : to.pathname;
    const targetSearch = (typeof to === 'object' && to.search) || '';
    const targetHash = (typeof to === 'object' && to.hash) || '';
    const fullTarget = targetPath + targetSearch + targetHash;

    if (options.replace) {
      window.history.replaceState(options.state || null, '', fullTarget);
    } else {
      window.history.pushState(options.state || null, '', fullTarget);
    }

    setLocation({
      pathname: targetPath,
      search: targetSearch,
      hash: targetHash,
      state: options.state || null
    });

    if (!options.preventScrollReset) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  const contextValue = useMemo(() => ({
    location,
    navigate
  }), [location, navigate]);

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(RouterContext);
  if (!context) {
    return { pathname: window.location.pathname, search: window.location.search, hash: window.location.hash };
  }
  return context.location;
}

export function useNavigate() {
  const context = useContext(RouterContext);
  if (!context) {
    return (to) => { window.location.href = to; };
  }
  return context.navigate;
}

const RouteParamsContext = createContext({});

export function useParams() {
  return useContext(RouteParamsContext);
}

function compilePath(pattern) {
  const paramNames = [];
  const regexPattern = pattern
    .replace(/\/+$/, '')
    .replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return '([^/]+)';
    })
    .replace(/\*/g, '.*');

  const regex = new RegExp(`^${regexPattern || '/'}$`);
  return { regex, paramNames };
}

function matchPath(pattern, pathname) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const normalizedPattern = pattern.replace(/\/+$/, '') || '/';

  if (normalizedPattern === '*') {
    return { matches: true, params: {} };
  }

  const { regex, paramNames } = compilePath(normalizedPattern);
  const match = normalizedPath.match(regex);

  if (!match) return null;

  const params = {};
  paramNames.forEach((name, index) => {
    params[name] = decodeURIComponent(match[index + 1]);
  });

  return { matches: true, params };
}

export function Routes({ children }) {
  const { location } = useContext(RouterContext) || { location: { pathname: window.location.pathname } };
  const currentPath = location.pathname;

  let matchedElement = null;
  let matchedParams = {};

  React.Children.forEach(children, (child) => {
    if (!matchedElement && React.isValidElement(child)) {
      const { path, element } = child.props;
      const match = matchPath(path, currentPath);
      if (match) {
        matchedElement = element;
        matchedParams = match.params;
      }
    }
  });

  if (!matchedElement) {
    return null;
  }

  return (
    <RouteParamsContext.Provider value={matchedParams}>
      {matchedElement}
    </RouteParamsContext.Provider>
  );
}

export function Route({ path, element }) {
  return null;
}

export function Link({ to, children, className = '', onClick, replace = false, ...props }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.altKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to, { replace });
    }
  };

  return (
    <a href={to} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

export function NavLink({ to, children, className, activeClassName = '', onClick, end = false, ...props }) {
  const location = useLocation();
  const isActive = end ? location.pathname === to : location.pathname.startsWith(to);

  let computedClassName = '';
  if (typeof className === 'function') {
    computedClassName = className({ isActive });
  } else {
    computedClassName = `${className || ''} ${isActive ? activeClassName : ''}`.trim();
  }

  return (
    <Link to={to} className={computedClassName} onClick={onClick} {...props}>
      {typeof children === 'function' ? children({ isActive }) : children}
    </Link>
  );
}

export function Navigate({ to, replace = true }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace, navigate]);
  return null;
}

export default {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useLocation,
  useParams,
  Navigate
};
