function route(handle, pathname, response) {
    console.log("About to route a request for [%s]", pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname]();
    } else {
        console.log("No request handler found for [%s]", pathname);
        responce.writeHead(404, { "Content-Type": "text/plain" });
        responce.write("404 Not found");
        responce.end();
    }
}

exports.route = route;