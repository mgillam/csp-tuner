# csp-tuner

## What is this?
 - A web interface for capturing and reviewing CSP violations
 - Currently quite rough
 - hardcoded to serve on port 3006 (you can change that by modifying `src/app.ts`
 - written for a blog post (link to be added later)
 
## How do you run it?

### On your local machine
Requires node and npm (testing was done with node 18.12.x)

 1. Install dependencies `npm install`
 2. Transpile `npm run build`
 3. Run `node ./dist/app.js`
 
### In Docker
Trades the requirement for node, for a requirement for docker
 1. Build the image `docker build -t csptuner .`
 2. Start the image `docker run --rm -ti -p 3006:3006 csptuner`
 
 ## What about SSL/TLS?
 Strictly speaking a minimal modification to the `src/app.ts` would make it possible, if you provided a trusted cert (e.g. via mkcert or something). Otherwise, you can shove a reverse proxy in front of it like nginx.
 
 ## License
 
