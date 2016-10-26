# Because zdi also creates an image named `nginx` locally, avoid collision by
# choosing a tag that Zendesk does not use.
FROM nginx:1.11-alpine

# For compatibility with `docker-images`'s
# `DockerCommandLineBuilder#development_manifest`, which is used with the
# development mode, deploy the app root to `/app`.
COPY dist /app/dist

COPY REVISION /REVISION

RUN ln -s /app/dist /usr/share/nginx/html/embeddable_framework

# Instead of using `daemon off;` in nginx.conf, use simple hack to keep process
# in the foreground.
CMD nginx && tail -f /dev/null
