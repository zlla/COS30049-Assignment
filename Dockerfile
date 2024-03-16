FROM ubuntu:latest

# Update package lists and install necessary packages
RUN apt-get update && \
    apt-get install -y curl sudo vim git zsh apache2 software-properties-common tmux && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set default shell to Zsh
RUN chsh -s $(which zsh)

# Install Oh My Zsh
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && \
    apt-get install -y nodejs

# Update npm
RUN npm i -g npm

# Install truffle
RUN npm install -g node-gyp
RUN apt install make
RUN sudo apt install -y build-essential
RUN npm install -g truffle

# Add Ethereum repository and install Ethereum
RUN add-apt-repository -y ppa:ethereum/ethereum && \
    apt-get update && \
    apt-get install -y ethereum && \
    apt-get upgrade -y geth

# Expose ports
EXPOSE 80
EXPOSE 8545
EXPOSE 22

# Set working directory
WORKDIR /app

# Start Apache (optional, if you really need it)
CMD ["apache2ctl", "-D", "FOREGROUND"]

