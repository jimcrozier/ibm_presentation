
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo service mongod start

sudo apt-get install nodejs
sudo apt-get install npm

 codename=$(lsb_release -c -s)  
 echo "deb http://ftp.iitm.ac.in/cran/bin/linux/ubuntu $codename/" | sudo tee -a /
  sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E084DAB9  
 sudo add-apt-repository ppa:marutter/rdev
  sudo apt-get update  
 sudo apt-get upgrade  
 sudo apt-get install r-base r-base-dev  

 sudo apt-get install libxml2-dev
 sudo apt-get install libcurl4-openssl-dev

sudo apt-get install gdebi-core libapparmor1

wget http://download2.rstudio.org/rstudio-server-0.98.1091-amd64.deb

sudo apt-get install python-setuptools python-dev build-essential
sudo easy_install pip
sudo pip install awscli --ignore-installed six

sudo easy_install git

aws configure