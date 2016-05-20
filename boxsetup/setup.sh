
adduser jim
#passwd jim 

chmod a+w /mnt/spark
chmod a+w /mnt2/spark
sed -e 's/^ulimit/#ulimit/g' /root/spark/conf/spark-env.sh > /root/spark/conf/spark-env2.sh
mv /root/spark/conf/spark-env2.sh /root/spark/conf/spark-env.sh
ulimit -n 1000000
/root/spark/sbin/stop-all.sh
/root/spark/sbin/start-all.sh

sudo yum -y remove R
sudo yum -y install R
sudo yum -y install libxml2-devel
sudo yum -y install libcurl libcurl-devel
sudo yum -y install openssl-devel
sudo yum -y install gcc44-gfortran
sudo yum install -y mysql55-server
sudo yum install -y mysql-devel
sudo service mysqld start
sudo yum -y install unixODBC
sudo yum -y install unixODBC-libs
sudo yum -y install unixODBC-devel
sudo yum -y install mysql-connector-odbc
sudo yum -y install freetds
sudo yum -y install freetds-devel
sudo yum -y install nodejs  --enablerepo=epel
sudo yum -y install npm --enablerepo=epel

wget http://archive.apache.org/dist/hive/hive-0.12.0/hive-0.12.0-bin.tar.gz
tar xzf hive-0.12.0-bin.tar.gz
mv hive-0.12.0-bin hive
#chown -R hadoop hive

export HADOOP_HOME=/root/ephemeral-hdfs
export HADOOP_PREFIX=/root/ephemeral-hdfs
export HIVE_HOME=/root/hive
export PATH=$HIVE_HOME/bin:$PATH

$HADOOP_HOME/bin/hadoop fs -mkdir /user/hive/warehouse
$HADOOP_HOME/bin/hadoop fs -mkdir /tmp
$HADOOP_HOME/bin/hadoop fs -chmod g+w /tmp
$HADOOP_HOME/bin/hadoop fs -chmod g+w /user/hive/warehouse


#./hadoop fs -ls hdfs://ec2-54-196-26-187.compute-1.amazonaws.com:9000/
#ec2-54-196-26-187.compute-1.amazonaws.com

#R /ODBC stuff 
echo "install.packages(c('rjson','Rcpp','magrittr','DBI','RODBC','shiny','RMySQL','randomNames','rmongodb'), repos='http://cran.us.r-project.org', lib = '/usr/lib64/R/library',dep=TRUE)" > tryinstall.R
sudo R CMD BATCH tryinstall.R 

#sql code 
mysqladmin create anchor; 


#vi /etc/odbc.ini 
#[mysql]
#Driver    = /usr/lib64/libmyodbc5.so
#SERVER    = localhost
#PORT    = 3306
#OPTION    = 3
#USER    = root

printf '[mysql] \nDriver=/usr/lib64/libmyodbc5.so \nSERVER=localhost\nPORT=3306 \nOPTION=3 \nUSER=root' > /etc/odbc.ini 
odbcinst -i -s -l -f /etc/odbc.ini
odbcinst -i -d -f /etc/odbcinst.ini

#ipython notebook --port=8888 --ip=*

yum install -y nano centos-release-SCL zlib-devel
yum install -y bzip2-devel openssl-devel ncurses-devel
yum install -y sqlite-devel readline-devel tk-devel
yum install -y gdbm-devel db4-devel libpcap-devel xz-devel
yum install -y libpng-devel libjpg-devel atlas-devel

wget http://www-us.apache.org/dist/incubator/zeppelin/0.5.6-incubating/zeppelin-0.5.6-incubating-bin-all.tgz
export SPARK_HOME="/root/spark"
sudo tar -zxf zeppelin-0.5.6-incubating-bin-all.tgz 


export HADOOP_HOME="/root/ephemeral-hdfs"
export ZEPPELIN_PORT=8888
/root/ibm_presentation/boxsetup/zeppelin-0.5.6-incubating-bin-all/bin/zeppelin-daemon.sh start

#./hadoop fs -mkdir hdfs://ec2-54-235-15-71.compute-1.amazonaws.com:9000/data
#./hadoop fs -put /root/data/bank-full.csv hdfs://ec2-54-235-15-71.compute-1.amazonaws.com:9000/data/bank-full.csv
#./hadoop fs -chmod 777 hdfs://ec2-54-196-26-187.compute-1.amazonaws.com:9000/tmp/hive


#wget http://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-5.1.39.tar.gz
#sudo yum install mysql-connector-java -y
#tar -zvf mysql-connector-java-5.1.39.tar.gz 

#export PYSPARK_PYTHON='/root/spark/python'

#primarily its for py4j distro and pyspark
#export PYTHONPATH='/root/spark/python:/root/spark/python/lib/py4j-0.9-src.zip'

#tar -xvf sqoop-1.4.6.bin__hadoop-1.0.0.tar.gz 
#export SQOOP_HOME=/usr/lib/sqoop export PATH=$PATH:$SQOOP_HOME/bin


#vim /etc/yum.repos.d/mongodb.repo

#[mongodb]
#name=MongoDB Repository
#baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
#gpgcheck=0
#enabled=1

printf '[mongodb] \nname=MongoDB Repository \nbaseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/ \ngpgcheck=0 \nenabled=1' > /etc/yum.repos.d/mongodb.repo 

yum -y update
yum -y install mongodb-org mongodb-org-server

mkdir /mnt/data
mkdir /mnt/data/db
mongod --dbpath /mnt/data/db


