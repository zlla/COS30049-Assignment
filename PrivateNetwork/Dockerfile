FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y curl sudo vim git zsh software-properties-common tmux && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN chsh -s $(which zsh)

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && \
    apt-get install -y nodejs

RUN npm i -g npm

RUN apt install make
RUN sudo apt install -y build-essential
RUN npm install -g node-gyp
RUN npm install -g truffle

RUN add-apt-repository -y ppa:ethereum/ethereum && \
    apt-get update && \
    apt-get install -y ethereum && \
    apt-get upgrade -y geth

WORKDIR /app

COPY . .

EXPOSE 8545
