FROM gcr.io/docker-images-180022/base/ruby:2.7.2-bionic-jemalloc
SHELL ["/bin/bash", "-c"]

RUN apt-get update && apt-get install -y git

# Install nvm, node, npm, yarn
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 12.21.0
RUN mkdir $NVM_DIR
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
RUN source $NVM_DIR/nvm.sh
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
RUN npm install -g yarn

WORKDIR /app
COPY . .

RUN yarn install --offline
RUN gem install bundler -v 1.17.3
RUN bundle install --quiet --local

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["yarn workspace @zendesk/embeddable-framework devserver"]
