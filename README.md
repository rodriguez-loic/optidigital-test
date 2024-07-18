# Opti Digital Test

## Prerequisite
This test contains a docker environment and is using `docker 27.0.3` and `docker-compose 2.28.1`:

https://docs.docker.com/engine/install/

https://docs.docker.com/compose/install/linux/

It also uses `node v22.4.1` and `npm 10.8.1`.

https://nodejs.org/en/learn/getting-started/how-to-install-nodejs

## Install

Please run:

```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
mkdir vue-app/dist && mkdir vue-app/node_modules
docker compose up -d
```

Any modification will require to run `npm run build` in the `vue-app` directory.

You can then access the resource at [localhost port 8080](http://localhost:8080).

**Reminder: This is done for a job application technical test and is not meant to be used on a production environment**


## Configuration

Please keep in mind this project is configured for localhost with example placement ids.
You should replace these ids in `.env` files alongside with `public/ads.txt`.
You should also create your own Google Tag Manager account.

## Debug

You can enable prebid dev debug by using [pbjs_debug=true](http://localhost:8080/?pbjs_debug=true) GET variable.
Another way to debug prebid.js and get relevant information concerning bids, CSM, etc is to use [Professor Prebid](https://chromewebstore.google.com/detail/professor-prebid/kdnllijdimhbledmfdbljampcdphcbdc?hl=fr) extension for Google Chrome.
You can also enable google console by using [googfc](http://localhost:8080/?googfc) GET variable.
