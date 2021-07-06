FROM gcr.io/docker-images-180022/base/ruby:2.7.2-bionic-jemalloc
SHELL ["/bin/bash", "-c"]

RUN apt-get update && apt-get install -y git

WORKDIR /app
COPY . .

RUN gem install bundler -v 1.17.3
RUN bundle install --quiet --local

# Install nvm, node, npm, yarn, npm packages and run build steps
ENV NVM_DIR /usr/local/nvm
RUN mkdir $NVM_DIR
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
RUN source $NVM_DIR/nvm.sh --install && \
    npm install -g yarn && \
    yarn install --offline && \
    yarn workspace @zendesk/embeddable-framework prebuild && \
    yarn workspace @zendesk/embeddable-framework build-setup:prod

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["export PATH=$NVM_DIR/versions/node/$(cat .nvmrc)/bin:$PATH && yarn workspace @zendesk/embeddable-framework dev"]
