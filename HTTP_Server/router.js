function route(handle, pathname) {
    console.log("About to route a request for [%s]", pathname);
    if (typeof handle[pathname] === 'function') {
       return  handle[pathname]();
    } else {
        console.log("No request handler found for [%s]", pathname);
        return "404 Not found";
    }
}

exports.route = route;