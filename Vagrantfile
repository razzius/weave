# -*- mode: ruby -*-
# vi: set ft=ruby :

ENV["PORT"] ||= "3000"

$provision = <<SCRIPT
sudo apt-get update
sudo apt-get install curl

DISTRO="$(lsb_release -s -c)"

# Add postgresql repository
curl -sS https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ $DISTRO-pgdg main" | sudo tee /etc/apt/sources.list.d/postgresql.list

# Add nodejs repository
curl -sS https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo apt-key add -
NODE_VERSION=node_12.10.x
echo "deb https://deb.nodesource.com/$NODE_VERSION $DISTRO main" | sudo tee /etc/apt/sources.list.d/nodesource.list
echo "deb-src https://deb.nodesource.com/$NODE_VERSION $DISTRO main" | sudo tee -a /etc/apt/sources.list.d/nodesource.list
sudo apt-get update
sudo apt-get install nodejs

# Install dependencies
sudo apt-get install -y \
  curl \
  python-minimal \
  python-pip \
  python3-distutils \
  python3.7 \
  postgresql-10

# Install pipenv
sudo -H pip install pipenv

# Install yarn
TEMPDIR=$(mktemp -d)
curl -sL https://github.com/yarnpkg/yarn/releases/download/v1.22.0/yarn_1.22.0_all.deb > $TEMPDIR/yarn.deb
sudo dpkg -i $TEMPDIR/yarn.deb
rm -r $TEMPDIR

# Create the database
sudo -u postgres createuser vagrant -s
sudo -u postgres createdb weave

# Persistently redirect tcp traffic from port 80 to port 3000
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port #{ENV["PORT"]}
echo iptables-persistent iptables-persistent/autosave_v4 boolean true | sudo debconf-set-selections
echo iptables-persistent iptables-persistent/autosave_v6 boolean true | sudo debconf-set-selections
sudo apt-get install -y iptables-persistent

cd /vagrant

# Install python dependencies
PIPENV_NOSPIN=1 pipenv install --dev

# Install database schema
pipenv run python -m server.scripts.resetdb

# Install javascript dependencies
# yarn install

# Automatically switch to /vagrant directory
test -e ~/.bash_profile || echo 'cd /vagrant' > ~/.bash_profile

SCRIPT

Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/bionic64"

  # Forward localhost:3000 for the frontend
  config.vm.network "forwarded_port", guest: 3000, host: 3000

  # Forward localhost:5000 for the backend
  config.vm.network "forwarded_port", guest: 5000, host: 5000

  # If you install the vagrant hosts updater plugin using
  #   $ vagrant plugin install vagrant-hostsupdater
  # Then you can access http://weave.local from your host machine.
  # If you enable this plugin, you will be prompted for your password when provisioning.
  # This is optional; if this is not used, you may access the virtual machine at http://192.168.33.10.
  if defined?(VagrantPlugins::HostsUpdater)
    config.vm.hostname = "weave.local"
    config.vm.network "private_network", ip: "192.168.42.42"
    config.hostsupdater.remove_on_suspend = false
  end

  config.vm.provider "virtualbox" do |vb|
    vb.name = "weave"
    vb.memory = "2048"
  end

  config.vm.provision "shell", inline: $provision, privileged: false
end
